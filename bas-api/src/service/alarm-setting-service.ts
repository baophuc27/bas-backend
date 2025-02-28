import { alarmSettingDao } from '@bas/database/dao';
import * as objectMapper from 'object-mapper';
import { alarmSettingMapper } from '@bas/database/mapper/alarm-setting-mapper';
import {
  AlarmCondition,
  AlarmSettingData,
  AlarmSettingDto,
  AlarmSensor,
} from '@bas/database/dto/response/alarm-setting-dto';
import { sequelizeConnection } from '@bas/database';
import { internalErrorCode } from '@bas/constant';
import NotFoundException from '@bas/api/errors/not-found-exception';
import { BadRequestException } from '@bas/api/errors';
import { alarmType } from '@bas/constant/alarm-status';
import { AlarmSettingUpdateDto } from '@bas/database/dto/request/alarm-setting-update-dto';
import { berthService } from '.';
import { Transaction } from 'sequelize';

export const findSetting = async (berthId: number, orgId: number) => {
  const results = await alarmSettingDao.findSetting({ berthId, orgId });
  const alarmSettings = results.map((row) => {
    return objectMapper.merge(row, alarmSettingMapper) as AlarmSettingDto;
  });

  const response: AlarmSettingData = {};

  alarmSettings.forEach((alarmSetting) => {
    const {
      alarmSensor,
      alarmType,
      id,
      operator,
      statusId,
      value,
      alarmZone,
      message,
      defaultValue,
    } = alarmSetting;
    if (!response[alarmZone]) {
      response[alarmZone] = {};
    }

    if (alarmType === 'angle') {
      if (!response[alarmZone][alarmType]) {
        response[alarmZone][alarmType] = [];
      }
      (response[alarmZone][alarmType] as AlarmCondition[]).push({
        alarmSettingId: id,
        status_id: statusId,
        operator,
        value,
        message,
        defaultValue,
      });
    } else {
      if (!response[alarmZone][alarmType]) {
        response[alarmZone][alarmType] = {};
      }

      if (!(response[alarmZone][alarmType] as AlarmSensor)[alarmSensor]) {
        (response[alarmZone][alarmType] as AlarmSensor)[alarmSensor] = [];
      }

      ((response[alarmZone][alarmType] as AlarmSensor)[alarmSensor] as AlarmCondition[]).push({
        alarmSettingId: id,
        status_id: statusId,
        operator,
        value,
        message,
        defaultValue,
      });
    }
  });

  return {
    data: response,
  };
};

export const updateSetting = async (alarmSettingDto: AlarmSettingUpdateDto[], orgId: number) => {
  const ids = alarmSettingDto.map((alarmSetting) => alarmSetting.id);
  const results = await alarmSettingDao.findByAllConditions(ids, orgId);
  if (!results || ids.length > results.length) {
    throw new NotFoundException(
      `Alarm setting with id ${ids.join(', ')} not found`,
      internalErrorCode.RESOURCE_NOT_FOUND
    );
  }

  const alarmSettings = results.map((row) => {
    return objectMapper.merge(row, alarmSettingMapper) as AlarmSettingDto;
  });

  const alarmSettingUpdate = alarmSettingDto.map((alarmSetting) => {
    const findAlarmSetting = alarmSettings.find((a) => a.id === alarmSetting.id);
    return {
      ...alarmSetting,
      statusId: findAlarmSetting?.statusId,
    };
  });

  for (let i = 0; i < alarmSettingUpdate.length - 1; i++) {
    if (alarmSettingUpdate[i].alarmType === alarmType.DISTANCE) {
      if (
        i === 0 &&
        alarmSettings[0].defaultValue &&
        alarmSettingUpdate[i].value >= alarmSettings[0].defaultValue
      ) {
        throw new BadRequestException(
          `Value of id = ${alarmSettingUpdate[i].id} must less than ${alarmSettings[0].defaultValue}`
        );
      }

      if (alarmSettingUpdate[i + 1].value >= alarmSettingUpdate[i].value) {
        throw new BadRequestException(
          `Value of id = ${alarmSettingUpdate[i + 1].id} must less than ${alarmSettingUpdate[i].value
          }`
        );
      }

      if (alarmSettingUpdate[i + 1].value && i > 0 && !alarmSettingUpdate[i].value) {
        throw new BadRequestException(
          `Value of id = ${alarmSettingUpdate[i].id} must greater than ${alarmSettingUpdate[i + 1].value
          } and less than ${alarmSettingUpdate[i - 1].value}`
        );
      }

      // Remove validation that prevents negative values for distance
      if (
        alarmSettingUpdate[alarmSettingUpdate.length - 1].value == undefined ||
        alarmSettingUpdate[alarmSettingUpdate.length - 1].value < -10
      ) {
        throw new BadRequestException(
          `Value of id = ${alarmSettingUpdate[alarmSettingUpdate.length - 1].id
          } must be defined`
        );
      }
    }

    if (
      alarmSettingUpdate[i].alarmType === alarmType.SPEED ||
      alarmSettingUpdate[i].alarmType === alarmType.ANGLE
    ) {
      if (
        i === 0 &&
        alarmSettings[0].defaultValue &&
        alarmSettingUpdate[i].value <= alarmSettings[0].defaultValue
      ) {
        throw new BadRequestException(
          `Value of id = ${alarmSettingUpdate[i].id} must greater than ${alarmSettings[0].defaultValue}`
        );
      }

      if (alarmSettingUpdate[i + 1].value <= alarmSettingUpdate[i].value) {
        throw new BadRequestException(
          `Value of id = ${alarmSettingUpdate[i + 1].id} must greater than ${alarmSettingUpdate[i].value
          }`
        );
      }

      if (alarmSettingUpdate[i + 1] && i > 0 && !alarmSettingUpdate[i].value) {
        throw new BadRequestException(
          `Value of id = ${alarmSettingUpdate[i].id} must less than ${alarmSettingUpdate[i + 1].value
          } and greater than ${alarmSettingUpdate[i - 1].value}`
        );
      }
    }

    if (
      (alarmSettingUpdate[alarmSettingUpdate.length - 1].alarmType === alarmType.ANGLE &&
        alarmSettingUpdate[alarmSettingUpdate.length - 1].value > 90) ||
      (alarmSettingUpdate[alarmSettingUpdate.length - 1].alarmType === alarmType.ANGLE &&
        !alarmSettingUpdate[alarmSettingUpdate.length - 1].value)
    ) {
      throw new BadRequestException(
        `Value of id = ${alarmSettingUpdate[alarmSettingUpdate.length - 1].id} must less than 90`
      );
    }
  }

  const response: any = [];

  for (const alarmSetting of alarmSettingUpdate) {
    const result = await alarmSettingDao.updateSetting(alarmSetting);

    const res = objectMapper.merge(result[1][0], alarmSettingMapper) as AlarmSettingDto;

    response.push(res);
  }

  return response;
};

export const resetDataAlarmSetting = async (berthId: number, orgId: number) => {
  const berth = await berthService.getBerthById(berthId, orgId);

  const results = await alarmSettingDao.findSetting({ berthId });
  const alarmSettings = results.map((row) => {
    return objectMapper.merge(row, alarmSettingMapper) as AlarmSettingDto;
  });

  await sequelizeConnection.transaction(async (t) => {
    const rs = defaultAlarmSettings(berth.limitZone1, berth.id, berth.orgId);
    for (const [index, alarmSetting] of alarmSettings.entries()) {
      await alarmSettingDao.resetValueAlarmSetting(
        {
          ...rs[index],
          id: alarmSetting.id,
        } as AlarmSettingUpdateDto,
        t
      );
    }
  });
};

const defaultAlarmSettings = (limitZone1: number | undefined, berthId: number, orgId: number) => {
  return [
    {
      alarmType: 'distance',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '>=',
      message: null,
      value: 10,
      defaultValue: Number.isFinite(limitZone1) ? limitZone1 : null,
    },
    {
      alarmType: 'distance',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '>=',
      message: null,
      value: 5,
      defaultValue: Number.isFinite(limitZone1) ? limitZone1 : null,
    },
    {
      alarmType: 'distance',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '>=',
      message: null,
      value: 0,
      defaultValue: Number.isFinite(limitZone1) ? limitZone1 : null,
    },
    {
      alarmType: 'distance',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '>=',
      message: null,
      value: 10,
      defaultValue: Number.isFinite(limitZone1) ? limitZone1 : null,
    },
    {
      alarmType: 'distance',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '>=',
      message: null,
      value: 5,
      defaultValue: Number.isFinite(limitZone1) ? limitZone1 : null,
    },
    {
      alarmType: 'distance',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: Number.isFinite(limitZone1) ? '>=' : '>',
      message: null,
      value: 0,
      defaultValue: Number.isFinite(limitZone1) ? limitZone1 : null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 30,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 40,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<',
      message: null,
      value: null,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 30,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 40,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<',
      message: null,
      value: null,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 5,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 10,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_1',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<=',
      message: null,
      value: 90,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 40,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 60,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<=',
      message: null,
      value: null,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 40,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 60,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<',
      message: null,
      value: null,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 10,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 20,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_2',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<=',
      message: null,
      value: 90,
      defaultValue: null,
    },

    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 40,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 60,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'left_sensor',
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<',
      message: null,
      value: null,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 40,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 60,
      defaultValue: null,
    },
    {
      alarmType: 'speed',
      alarmSensor: 'right_sensor',
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<',
      message: null,
      value: null,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 1,
      operator: '<=',
      message: null,
      value: 10,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 2,
      operator: '<=',
      message: null,
      value: 20,
      defaultValue: null,
    },
    {
      alarmType: 'angle',
      alarmSensor: null,
      alarmZone: 'zone_3',
      berthId: berthId,
      orgId: orgId,
      statusId: 3,
      operator: '<=',
      message: null,
      value: 90,
      defaultValue: null,
    },
  ];
};

export const createNewAlarmSettingSet = async (
  berthId: number,
  orgId: number,
  limitZone1: number,
  transaction?: Transaction
) => {
  try {
    const settingSet = defaultAlarmSettings(limitZone1, berthId, orgId);

    const response: any = [];

    for (const alarmSetting of settingSet) {
      await alarmSettingDao.createAlarmSetting(berthId, orgId, alarmSetting, transaction);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
