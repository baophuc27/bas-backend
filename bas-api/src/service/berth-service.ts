import { BerthDetailDto } from '@bas/database/dto/response/berth-detail-dto';
import {
  BerthFilter,
  resetBerthParam,
  StartRecordAlarmPayload,
  StartRecordPayload,
} from './typing';
import { alarmSettingDao, berthDao } from '@bas/database/dao';
import * as objectMapper from 'object-mapper';
import { berthDetailMapper } from '@bas/database/mapper/berth-mapper';
import NotFoundException from '@bas/api/errors/not-found-exception';
import { internalErrorCode } from '@bas/constant';
import { BerthUpdateDto } from '@bas/database/dto/request/berth-update-dto';
import { BerthConfigDto } from '@bas/database/dto/request/berth-config-dto';
import { BerthStatus, fromBerthStatus, toBerthStatus } from '@bas/constant/berth-status';
import {
  alarmSettingService,
  kafkaService,
  queueService,
  realtimeService,
  recordService,
  vesselService,
} from './index';
import { sequelizeConnection } from '@bas/database';
import { BadRequestException } from '@bas/api/errors';
import { generateRecordSession } from '@bas/utils';
import moment from 'moment-timezone';
import { recordCreateMapper } from '@bas/database/mapper/record-mapper';
import { BAS_RECORD_DATA } from '@bas/constant/kafka-topic';
import {
  AlarmCondition,
  AlarmSensor,
  AlarmSettingData,
  AlarmSettingDto,
} from '@bas/database/dto/response/alarm-setting-dto';
import { alarmSettingMapper } from '@bas/database/mapper/alarm-setting-mapper';

export const getBerthById = async (berthId: number, orgId: number) => {
  const result = await berthDao.getBerthInfo(berthId, orgId);
  if (!result) {
    throw new NotFoundException(
      `Berth with id ${berthId} not found`,
      internalErrorCode.RESOURCE_NOT_FOUND
    );
  }
  const record = await recordService.getCurrentRecord(berthId, orgId);
  const res = objectMapper.merge(result, berthDetailMapper) as BerthDetailDto;
  if (record) {
    res.record = {
      berthId: record.berthId,
      orgId: record.orgId,
      vesselId: record.vesselId,
      id: record.id,
      sessionId: record.sessionId,
      endTime: record.endTime ? moment(record.endTime).toDate().toISOString() : null,
      startTime: moment(record.startTime).toDate().toISOString(),
    };
  }
  return res;
};

export const deleteBerth = async (berthId: number, orgId: number) => {
  const isRecording = await recordService.getCurrentRecord(berthId, orgId);
  if (isRecording) {
    throw new BadRequestException(
      `Berth with id ${berthId} is recording`,
      internalErrorCode.INVALID_INPUT
    );
  }

  const result = await berthDao.deleteBerth(berthId, orgId);
  if (result) {
    realtimeService.removeBerthRealtime(berthId, orgId);
  }
  if (!result) {
    throw new NotFoundException(
      `Berth with id ${berthId} not found`,
      internalErrorCode.RESOURCE_NOT_FOUND
    );
  }
  return result;
};

export const getAllBerths = async (filter: BerthFilter) => {
  const result = await berthDao.getAllBerths(filter);
  const data = result.rows.map((row) => {
    return objectMapper.merge(row, berthDetailMapper) as BerthDetailDto;
  });
  return {
    data,
    count: result.count,
  };
};

export const updateBerth = async (
  berthId: number,
  orgId: number,
  data: BerthUpdateDto,
  modifier: string
) => {
  const { limitZone1, limitZone2, limitZone3 } = data;
  const berth = await berthDao.getBerthInfo(berthId, orgId);
  if (!berth) {
    throw new NotFoundException(
      `Berth with id ${berthId} not found`,
      internalErrorCode.RESOURCE_NOT_FOUND
    );
  }
  const results = await alarmSettingDao.findSetting({
    berthId,
    orgId,
    alarmType: 'distance',
    alarmZone: 'zone_1',
  });
  const alarmSettings = results.map((row) => {
    return objectMapper.merge(row, alarmSettingMapper) as AlarmSettingDto;
  });

  if (data.limitZone1) {
    if (alarmSettings[0].value >= +data.limitZone1) {
      throw new BadRequestException(
        `Value of limitZone1 must greater than ${alarmSettings[0].value}`
      );
    }

    await alarmSettingDao.updateDefaultValue(+data.limitZone1, orgId, berthId);
  }

  if (limitZone1 && limitZone2 && limitZone3) {
    if (+limitZone1 >= +limitZone2 || +limitZone2 >= +limitZone3) {
      throw new BadRequestException('Invalid limit zone value', internalErrorCode.INVALID_INPUT);
    }
  }
  const updated = await berthDao.updateBerth(berthId, orgId, data, modifier);
  return objectMapper.merge(updated[1][0], berthDetailMapper) as BerthDetailDto;
};

export const configurationBerth = async (
  berthId: number,
  orgId: number,
  data: BerthConfigDto,
  modifier: string
) => {
  const berth = await berthDao.getBerthInfo(berthId, orgId);
  if (!berth) {
    throw new NotFoundException(
      `Berth with id ${berthId} not found`,
      internalErrorCode.RESOURCE_NOT_FOUND
    );
  }
  if (!orgId) {
    throw new Error('orgId is required');
  }
  let isSend = true;
  const res = await sequelizeConnection.transaction(async (t) => {
    let vessel = (await vesselService.upsertVessel(data.vessel, t))[0];
    const existRecord = await recordService.getCurrentRecord(berthId, orgId, t);

    if (existRecord) {
      isSend = false;
    }

    const updated = await berthDao.updateBerth(
      berthId,
      orgId,
      {
        distanceToRight: data.distanceToRight,
        distanceToLeft: data.distanceToLeft,
        vesselId: vessel.id,
        status: data.status,
        vesselDirection: data.vesselDirection,
      },
      modifier,
      t
    );
    const mooringStatus =
      fromBerthStatus(berth.status) === BerthStatus.AVAILABLE ||
      fromBerthStatus(berth.status) === BerthStatus.BERTHING
        ? BerthStatus.BERTHING
        : BerthStatus.DEPARTING;

    return (
      existRecord ||
      (await recordService.createRecord(
        {
          berthId,
          orgId,
          vesselId: vessel.id,
          sessionId: generateRecordSession(berthId, vessel.id),
          createdBy: modifier,
          startTime: moment().utc().toDate(),
          endTime: null,
          vesselDirection: data.vesselDirection ? 1 : 0,
          limitZone1: berth.limitZone1,
          limitZone2: berth.limitZone2,
          limitZone3: berth.limitZone3,
          directionCompass: berth.directionCompass,
          distanceFender: berth.distanceFender,
          distanceDevice: berth.distanceDevice,
          distanceToLeft: data.distanceToLeft,
          distanceToRight: data.distanceToRight,
          syncStatus: 'PENDING',
          mooringStatus: mooringStatus,
        },
        t
      ))
    );
  });
  if (isSend && res?.id) {
    await kafkaService.produceKafkaData(
      BAS_RECORD_DATA,
      JSON.stringify({
        orgId: orgId,
        berth_id: berthId,
        session_id: res.id,
        mode: 'start',
        distance_left_sensor_to_fender: data.distanceToLeft,
        distance_right_sensor_to_fender: data.distanceToRight,
        distance_between_sensors: berth.distanceDevice,
        limit_zone_1: berth.limitZone1,
        limit_zone_2: berth.limitZone2,
        limit_zone_3: berth.limitZone3,
        alarm: await alarmSettingData(berthId, orgId),
      } as StartRecordPayload)
    );
    // const key = `${berthId}-${orgId}`;
    realtimeService.addBerthToWatch(
      berthId,
      orgId,
      new Date(res.startTime).getTime(),
      res?.mooringStatus == BerthStatus.BERTHING ? BerthStatus.BERTHING : BerthStatus.DEPARTING
    );
  }

  return objectMapper.merge(res, recordCreateMapper);
};

const alarmSettingData = async (berthId: number, orgId: number) => {
  const results = await alarmSettingDao.findSetting({ berthId, orgId });

  const alarmSettings = results.map((row) => {
    return objectMapper.merge(row, alarmSettingMapper) as AlarmSettingDto;
  });

  const response: AlarmSettingData = {};

  alarmSettings.forEach((alarmSetting) => {
    const { alarmSensor, alarmType, operator, statusId, value, alarmZone } = alarmSetting;
    if (!response[alarmZone]) {
      response[alarmZone] = {};
    }

    if (alarmType === 'angle') {
      if (!response[alarmZone][alarmType]) {
        response[alarmZone][alarmType] = [];
      }
      (response[alarmZone][alarmType] as AlarmCondition[]).push({
        status_id: statusId,
        operator,
        value,
      });
    } else {
      if (!response[alarmZone][alarmType]) {
        response[alarmZone][alarmType] = {};
      }

      if (!(response[alarmZone][alarmType] as AlarmSensor)[alarmSensor]) {
        (response[alarmZone][alarmType] as AlarmSensor)[alarmSensor] = [];
      }

      ((response[alarmZone][alarmType] as AlarmSensor)[alarmSensor] as AlarmCondition[]).push({
        status_id: statusId,
        operator,
        value,
      });
    }
  });

  return response;
};

const validateStatus = (currentStatus: BerthStatus | null, changedStatus: BerthStatus | null) => {
  if (!currentStatus || !changedStatus) {
    throw new BadRequestException('Invalid change status', internalErrorCode.INVALID_INPUT);
  }
  switch (currentStatus) {
    case BerthStatus.AVAILABLE:
      if ([BerthStatus.MOORING].includes(changedStatus)) {
        throw new BadRequestException('Invalid change status', internalErrorCode.INVALID_INPUT);
      }
      break;
    case BerthStatus.MOORING:
      if ([BerthStatus.AVAILABLE].includes(changedStatus)) {
        throw new BadRequestException('Invalid change status', internalErrorCode.INVALID_INPUT);
      }
      break;
    case BerthStatus.BERTHING:
      if ([BerthStatus.MOORING, BerthStatus.AVAILABLE].includes(changedStatus)) {
        throw new BadRequestException('Invalid change status', internalErrorCode.INVALID_INPUT);
      }
      break;
    case BerthStatus.DEPARTING:
      if (
        [BerthStatus.AVAILABLE, BerthStatus.MOORING, BerthStatus.BERTHING].includes(changedStatus)
      ) {
        throw new BadRequestException('Invalid change status', internalErrorCode.INVALID_INPUT);
      }
      break;
    default:
      return;
  }
};

export const resetBerth = async (params: resetBerthParam) => {
  let { berthId, orgId, status, modifier, isError, isFinish } = params;
  let isSync = false;
  const berth = await berthDao.getBerthInfo(berthId, orgId);
  if (!berth) {
    throw new NotFoundException(
      `Berth with id ${berthId} not found`,
      internalErrorCode.RESOURCE_NOT_FOUND
    );
  }

  if (isFinish && fromBerthStatus(berth.status) == BerthStatus.DEPARTING) {
    status = BerthStatus.AVAILABLE;
  }

  const existRecord = await recordService.getCurrentRecord(berthId, orgId);
  if (existRecord) {
    await kafkaService.produceKafkaData(
      BAS_RECORD_DATA,
      JSON.stringify({
        berth_id: berthId,
        session_id: existRecord.id,
        mode: 'stop',
      } as StartRecordPayload)
    );
    await recordService.endRecord(existRecord.id, existRecord.orgId);
    const key = `${berthId}-${orgId}`;
    realtimeService.removeBerthFromWatch(key);
    if (isError) {
      await recordService.remove(existRecord.id, existRecord.orgId);
    }
    isSync = await recordService.sync(existRecord.id, existRecord.orgId);
  }
  const updated = await berthDao.updateBerth(
    berthId,
    orgId,
    {
      ...(status == BerthStatus.AVAILABLE
        ? {
            vesselId: null,
            vesselDirection: null,
          }
        : {}),
      status: toBerthStatus(status),
    },
    modifier
  );
  if (existRecord?.id) {
    await queueService.pushToQueue('alarm-save', { type: 'stop', recordId: existRecord.id });
  }

  if (status == BerthStatus.AVAILABLE) {
    await alarmSettingService.resetDataAlarmSetting(berthId, orgId);
  }

  return {
    data: objectMapper.merge(updated[1][0], berthDetailMapper) as BerthDetailDto,
    isSync,
  };
};

export const createBerth = async (data: BerthUpdateDto, modifier: string) => {
  const { limitZone1 = 60, limitZone2 = 120, limitZone3 = 200 } = data;

  if (limitZone1 && limitZone2 && limitZone3) {
    if (+limitZone1 >= +limitZone2 || +limitZone2 >= +limitZone3) {
      throw new BadRequestException('Invalid limit zone value', internalErrorCode.INVALID_INPUT);
    }
  }

  const res = await sequelizeConnection.transaction(async (t) => {
    const result = await berthDao.createBerth(
      {
        ...data,
        leftDeviceId: 1,
        rightDeviceId: 2,
      },
      modifier,
      t
    );

    await alarmSettingService.createNewAlarmSettingSet(result.id, result.orgId, limitZone1, t);
    return result;
  });

  realtimeService.addBerthRealtime(res.id, res.orgId, res.leftDeviceId!, res.rightDeviceId!);
  return objectMapper.merge(res, berthDetailMapper) as BerthDetailDto;
};

export const getAllBerthWithSensor = () => {
  return berthDao.getAllBerthWithSensor();
};
