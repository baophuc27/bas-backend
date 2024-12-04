import { Op, Transaction } from 'sequelize';
import { AlarmSetting, Berth } from '../models';
import { AlarmSettingUpdateDto } from '../dto/request/alarm-setting-update-dto';

const findSetting = async (conditions: object) => {
  const results = await AlarmSetting.findAll({
    include: [
      {
        model: Berth,
        required: true,
        as: 'berth',
        attributes: ['id', 'name', 'orgId'],
      },
    ],
    where: { ...conditions },
    order: [
      ['alarmZone', 'asc'],
      ['id', 'asc'],
    ],
  });

  return results;
};

const updateSetting = async (alarmSettingDto: AlarmSettingUpdateDto, t?: Transaction) => {
  let operator = undefined;
  if (alarmSettingDto.alarmType === 'distance') {
    operator = Number.isFinite(alarmSettingDto.value) ? '>=' : '>';
  } else {
    operator = Number.isFinite(alarmSettingDto.value) ? '<=' : '<';
  }

  return await AlarmSetting.update(
    {
      value: Number.isFinite(alarmSettingDto.value) ? alarmSettingDto.value : null,
      message: alarmSettingDto.message ? alarmSettingDto.message : null,
      operator: operator,
    },
    {
      where: {
        id: alarmSettingDto.id,
        berthId: alarmSettingDto.berthId,
        orgId: alarmSettingDto.orgId,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

const updateDefaultValue = async (
  defaultValue: number,
  berthId: number,
  orgId: number,
  t?: Transaction
) => {
  return await AlarmSetting.update(
    {
      defaultValue,
    },
    {
      where: {
        berthId,
        alarmType: 'distance',
        alarmZone: 'zone_1',
        orgId,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

const findByAllConditions = async (ids: number[], orgId: number) => {
  const results = await AlarmSetting.findAll({
    where: {
      id: ids,
      orgId: orgId,
    },
    order: [
      ['alarmZone', 'asc'],
      ['id', 'asc'],
    ],
  });
  return results;
};

const getNextRecord = async (
  id: number,

  alarmZone: string,
  alarmSensor: string,
  alarmType: string
) => {
  const result = await AlarmSetting.findOne({
    where: {
      id: {
        [Op.gt]: id,
      },
      alarmZone,
      alarmType,
      alarmSensor,
    },
    order: [['id', 'ASC']],
  });

  return result?.dataValues;
};

const getPreviousRecord = async (
  id: number,
  alarmZone: string,
  alarmSensor: string,
  alarmType: string
) => {
  const result = await AlarmSetting.findOne({
    where: {
      id: {
        [Op.lt]: id,
      },
      alarmZone,
      alarmType,
      alarmSensor,
    },
    order: [['id', 'DESC']],
  });

  return result?.dataValues;
};

const findByBerthId = async (berthId: number) => {
  return await AlarmSetting.findAll({
    where: {
      berthId,
    },
    order: [['id', 'DESC']],
  });
};

export const resetValueAlarmSetting = async (
  alarmSettingDto: AlarmSettingUpdateDto,
  t?: Transaction
) => {
  return await AlarmSetting.update(
    {
      message: alarmSettingDto.message,
      alarmSensor: alarmSettingDto.alarmSensor,
      alarmType: alarmSettingDto.alarmType,
      alarmZone: alarmSettingDto.alarmZone,
      operator: alarmSettingDto.operator,
      value: alarmSettingDto.value,
      defaultValue: alarmSettingDto.defaultValue,
      statusId: alarmSettingDto.statusId,
    },
    {
      where: {
        id: alarmSettingDto.id,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

const createAlarmSetting = async (
  berthId: number,
  orgId: number,
  alarmSettingDto: any,
  t?: Transaction
) => {
  return await AlarmSetting.create(
    {
      orgId: orgId,
      berthId: berthId,
      message: alarmSettingDto.message,
      alarmSensor: alarmSettingDto.alarmSensor,
      alarmType: alarmSettingDto.alarmType,
      alarmZone: alarmSettingDto.alarmZone,
      operator: alarmSettingDto.operator,
      statusId: alarmSettingDto.statusId,
      value: alarmSettingDto.value,
      defaultValue: alarmSettingDto.defaultValue,
    },
    {
      ...(t && { transaction: t }),
    }
  );
};

export const findAlarmSettingByBerthIds = async (berthIds: number[]) => {
  return await AlarmSetting.findAll({
    where: {
      berthId: {
        [Op.in]: berthIds,
      },
    },
  });
};

export {
  findSetting,
  updateSetting,
  findByAllConditions,
  getNextRecord,
  getPreviousRecord,
  findByBerthId,
  updateDefaultValue,
  createAlarmSetting,
};
