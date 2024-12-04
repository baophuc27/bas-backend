import { alarmDao, recordDao, recordHistoryDao } from '@bas/database/dao';
import { AlarmDataUnit, RecordFilter, RecordHistoryQueryParams } from './typing';
import { RecordDetailDto } from '@bas/database/dto/response/record-detail.dto';
import * as objectMapper from 'object-mapper';
import { recordAggregateMapper, recordDetailMapper } from '@bas/database/mapper/record-mapper';
import { Transaction } from 'sequelize';
import { cloudService, queueService, recordHistoryService } from './index';
import RecordHistory from '@bas/database/models/record-history-model';
import { Record } from '@bas/database';
import { alarmStatus } from '@bas/constant/alarm-status';
import {
  recordHistoryChartMapper,
  recordHistoryMapper,
  recordHistoryMapperReverse,
} from '@bas/database/mapper/record-history-mapper';
import { BadRequestException } from '@bas/api/errors';
import { internalErrorCode, RecordSyncStatus } from '@bas/constant';

export const findAll = async (recordFilter: RecordFilter) => {
  const result = await recordDao.findAll(recordFilter);

  const data = result.rows.map((row) => {
    return objectMapper.merge(row, recordDetailMapper) as RecordDetailDto;
  });

  return {
    data,
    count: result.count,
  };
};

export const getAggregatesByRecordId = async (recordId: number, orgId: number) => {
  const result = await recordDao.getAggregatesByRecordId(recordId, orgId);

  const aggregates = objectMapper.merge(
    result.aggregates[0]?.dataValues || {},
    recordAggregateMapper
  );
  return {
    data: {
      aggregates,
    },
  };
};

export const getChartByRecordId = async (recordId: number, orgId: number) => {
  const result = await recordDao.getChartByRecordId(recordId, orgId);

  const chart = result?.chart?.map((recordHistory) => {
    return objectMapper.merge(recordHistory, recordHistoryChartMapper);
  });
  return {
    data: {
      chart,
    },
  };
};

export const getRecordHistoryByRecordId = async (
  recordId: number,
  orgId: number,
  recordHistoryQueryParams: RecordHistoryQueryParams
) => {
  const result = await recordDao.getRecordHistoryByRecordId(
    recordId,
    orgId,
    recordHistoryQueryParams
  );

  const record = objectMapper.merge(result.record || {}, recordDetailMapper);
  const recordHistories = result.recordHistories.map((recordHistory) => {
    return objectMapper.merge(recordHistory, recordHistoryMapper);
  });

  return {
    data: {
      ...record,
      recordHistories,
    },
    count: result.count,
  };
};

export const getRecordHistoryByRecordIdWithoutPagination = async (
  recordId: number,
  orgId: number
) => {
  const result = await recordDao.findAllWithoutPagination(recordId, orgId);

  const record = objectMapper.merge(result.record || {}, recordDetailMapper);
  const recordHistories = result.recordHistories.map((recordHistory) => {
    return objectMapper.merge(recordHistory, recordHistoryMapper);
  });

  const resultAggregates = await recordDao.getAggregatesByRecordId(recordId, orgId);

  const aggregates = objectMapper.merge(
    resultAggregates.aggregates[0]?.dataValues || {},
    recordAggregateMapper
  );

  const resultChart = await recordDao.getChartByRecordId(recordId, orgId);

  const chart = resultChart?.chart?.map((recordHistory) => {
    return objectMapper.merge(recordHistory, recordHistoryChartMapper);
  });

  return {
    ...record,
    recordHistories,
    aggregates,
    chart,
  };
};

export const remove = async (id: number, orgId: number) => {
  const recordExist = await recordDao.getRecordById(id, orgId);
  if (!recordExist?.endTime) {
    throw new BadRequestException('Record is not ended yet', internalErrorCode.INVALID_INPUT);
  }
  return await recordDao.remove(id, orgId);
};

export const getCurrentRecord = async (berthId: number, orgId: number, t?: Transaction) => {
  return recordDao.getCurrentRecord(berthId, orgId, t);
};

export const createRecord = async (data: any, t?: Transaction) => {
  return recordDao.createRecord(data, t);
};

export const endRecord = async (
  recordId: number,
  orgId: number,
  t?: Transaction
) => {
  return recordDao.endRecord(recordId, orgId, t);
};

export const getRecordById = async (recordId: number, orgId: number) => {
  return recordDao.getRecordByIdAndNotEnd(recordId, orgId);
};

export const findLatestRecord = async (
  berthId: number,
  orgId: number,
  startTime: Date,
  endTime: Date,
  raw?: boolean
) => {
  //   get data history 24h last
  const recordHistory = await recordHistoryService.getAllRecordHistoryBetweenTime(
    berthId,
    orgId,
    startTime,
    endTime
  );
  const records = await recordDao.findRecordByIds(
    recordHistory.map((record) => record.recordId),
    orgId
  );
  if (!raw) {
    return recordHistory.length > 0 ? await convertToAlarmData(recordHistory, records) : [];
  } else {
    return recordHistory.map((frame) => {
      const record = records.find((record) => record.id === frame.recordId);
      return objectMapper.merge(
        frame,
        recordHistoryMapperReverse(
          record?.berth?.leftDevice?.id || 1,
          record?.berth?.rightDevice?.id || 2
        )
      );
    });
  }
};

const SIDE = {
  LEFT: 1,
  RIGHT: 2,
};

const convertToAlarmData = async (frames: RecordHistory[], records?: Record[]) => {
  let alarmData: AlarmDataUnit[] = [];
  let leftSpeed: AlarmDataUnit[] = [];
  let rightSpeed: AlarmDataUnit[] = [];
  let leftDistance: AlarmDataUnit[] = [];
  let rightDistance: AlarmDataUnit[] = [];
  let angle: AlarmDataUnit[] = [];

  frames.forEach((alarm, index) => {
    const currentLeftSpeed = extractAlarmData(alarm, 'speed', SIDE.LEFT);
    if (
      currentLeftSpeed.value !== leftSpeed[leftSpeed.length - 1]?.value &&
      currentLeftSpeed.alarm !== alarmStatus.OPERATOR
    ) {
      if (leftSpeed[leftSpeed.length - 1]) {
        leftSpeed[leftSpeed.length - 1].endTime = currentLeftSpeed.startTime;
      }
      leftSpeed.push(currentLeftSpeed);
    }

    const currentRightSpeed = extractAlarmData(alarm, 'speed', SIDE.RIGHT);
    if (
      currentRightSpeed.value !== rightSpeed[rightSpeed.length - 1]?.value &&
      currentRightSpeed.alarm !== alarmStatus.OPERATOR
    ) {
      if (rightSpeed[rightSpeed.length - 1]) {
        rightSpeed[rightSpeed.length - 1].endTime = currentRightSpeed.startTime;
      }
      rightSpeed.push(currentRightSpeed);
    }

    const currentLeftDistance = extractAlarmData(alarm, 'distance', SIDE.LEFT);
    if (
      currentLeftDistance.value !== leftDistance[leftDistance.length - 1]?.value &&
      currentLeftDistance.alarm &&
      currentLeftDistance.alarm > alarmStatus.WARNING
    ) {
      if (leftDistance[leftDistance.length - 1]) {
        leftDistance[leftDistance.length - 1].endTime = currentLeftDistance.startTime;
      }
      leftDistance.push(currentLeftDistance);
    }

    const currentRightDistance = extractAlarmData(alarm, 'distance', SIDE.RIGHT);
    if (
      currentRightDistance.value !== rightDistance[rightDistance.length - 1]?.value &&
      currentRightDistance.alarm &&
      currentRightDistance.alarm > alarmStatus.WARNING
    ) {
      if (rightDistance[rightDistance.length - 1]) {
        rightDistance[rightDistance.length - 1].endTime = currentRightDistance.startTime;
      }
      rightDistance.push(currentRightDistance);
    }

    const currentAngle = extractAlarmData(alarm, 'angle');
    if (
      currentAngle.value !== angle[angle.length - 1]?.value &&
      currentAngle.alarm !== alarmStatus.OPERATOR
    ) {
      if (angle[angle.length - 1]) {
        angle[angle.length - 1].endTime = currentAngle.startTime;
      }
      angle.push(currentAngle);
    }
  });

  if (leftSpeed.length) {
    leftSpeed[leftSpeed.length - 1].endTime = records?.find(
      (record) => record.id === leftSpeed[leftSpeed.length - 1]?.recordId
    )?.endTime;
  }

  if (rightSpeed.length) {
    rightSpeed[rightSpeed.length - 1].endTime = records?.find(
      (record) => record.id === rightSpeed[rightSpeed.length - 1]?.recordId
    )?.endTime;
  }

  if (leftDistance.length) {
    leftDistance[leftDistance.length - 1].endTime = records?.find(
      (record) => record.id === leftDistance[leftDistance.length - 1]?.recordId
    )?.endTime;
  }

  if (rightDistance.length) {
    rightDistance[rightDistance.length - 1].endTime = records?.find(
      (record) => record.id === rightDistance[rightDistance.length - 1]?.recordId
    )?.endTime;
  }

  if (angle.length) {
    angle[angle.length - 1].endTime = records?.find(
      (record) => record.id === angle[angle.length - 1]?.recordId
    )?.endTime;
  }

  alarmData.push(...leftSpeed, ...rightSpeed, ...leftDistance, ...rightDistance, ...angle);
  return alarmData
    .filter((item) => item.alarm != alarmStatus.OPERATOR)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
};

const extractAlarmData = (alarmData: RecordHistory, type: string, side?: number): AlarmDataUnit => {
  switch (type) {
    case 'speed':
      if (side === SIDE.LEFT) {
        return {
          startTime: alarmData.time,
          value: alarmData.leftSpeed,
          alarm: alarmData.LSpeedAlarm,
          zone: alarmData.LSpeedZone,
          recordId: alarmData.recordId,
          type: 'speed',
          side: SIDE.LEFT,
        };
      } else {
        return {
          startTime: alarmData.time,
          value: alarmData.rightSpeed,
          alarm: alarmData.RSpeedAlarm,
          zone: alarmData.RSpeedZone,
          recordId: alarmData.recordId,
          type: 'speed',
          side: SIDE.RIGHT,
        };
      }
    case 'distance':
      if (side === SIDE.LEFT) {
        return {
          startTime: alarmData.time,
          value: alarmData.leftDistance,
          alarm: alarmData.LDistanceAlarm,
          zone: alarmData.LDistanceZone,
          recordId: alarmData.recordId,
          type: 'distance',
          side: SIDE.LEFT,
        };
      } else {
        return {
          startTime: alarmData.time,
          value: alarmData.rightDistance,
          alarm: alarmData.RDistanceAlarm,
          zone: alarmData.RDistanceZone,
          recordId: alarmData.recordId,
          type: 'distance',
          side: SIDE.RIGHT,
        };
      }
    default:
      return {
        startTime: alarmData.time,
        value: alarmData.angle,
        alarm: alarmData.angleAlarm,
        zone: alarmData.angleZone,
        recordId: alarmData.recordId,
        type: 'angle',
      };
  }
};

export const sync = async (recordId: number, orgId: number) => {
  const result = await recordDao.findAllWithoutPagination(recordId, orgId);

  if (!result) {
    throw new BadRequestException('Record not found', internalErrorCode.INVALID_INPUT);
  }

  if (!result.record?.endTime) {
    throw new BadRequestException('Record is ended', internalErrorCode.INVALID_INPUT);
  }

  const payload = {
    recordInformation: {
      ...result.record,
      recordLocalId: result.record.id,
      id: undefined,
    },
    frame:
      result.recordHistories.map((recordHistory) => {
        return objectMapper.merge(recordHistory, recordHistoryMapper);
      }) || [],
    berthInformation: {
      ...result.record.berth?.dataValues,
    },
    vesselInformation: {
      ...result.record.vessel?.dataValues,
    },
  };
  const sync = await cloudService.syncRecordToCloud(payload);
  const status = sync ? RecordSyncStatus.SUCCESS : RecordSyncStatus.FAILED;
  await recordDao.updateStatus(recordId, orgId, status);

  return sync;
};
