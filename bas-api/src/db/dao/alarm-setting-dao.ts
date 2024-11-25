import { Op, Transaction } from 'sequelize';
import { AlarmSetting, Berth } from '../models';
import { AlarmSettingUpdateDto } from '../dto/request/alarm-setting-update-dto';
import { AsyncContext } from '@bas/utils/AsyncContext';

const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    console.warn('[ALARM-SETTING] No orgId found in context.');
    // throw new Error('orgId is required but not found in context');
    return { orgId: 0 };
  }
  return { orgId: context.orgId };
};

const orgCondition = addOrgIdToConditions();

const findSetting = async (conditions: object) => {
  const orgCondition = addOrgIdToConditions(); // Lấy orgId từ AsyncContext
  const results = await AlarmSetting.findAll({
    include: [
      {
        model: Berth,
        required: true,
        as: 'berth',
        attributes: ['id', 'name', 'orgId'],
      },
    ],
    where: { ...conditions, ...orgCondition },
    order: [
      ['alarmZone', 'asc'],
      ['id', 'asc'],
    ],
  });

  return results;
};

const updateSetting = async (alarmSettingDto: AlarmSettingUpdateDto, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions(); // Lấy orgId động
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
        ...orgCondition,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

const updateDefaultValue = async (defaultValue: number, berthId: number, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return await AlarmSetting.update(
    {
      defaultValue,
    },
    {
      where: {
        berthId,
        alarmType: 'distance',
        alarmZone: 'zone_1',
        ...orgCondition,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

const findByAllConditions = async (ids: number[]) => {
  const orgCondition = addOrgIdToConditions();
  const results = await AlarmSetting.findAll({
    where: {
      id: ids,
      ...orgCondition,
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
  const orgCondition = addOrgIdToConditions();
  const result = await AlarmSetting.findOne({
    where: {
      id: {
        [Op.gt]: id,
      },
      alarmZone,
      alarmType,
      alarmSensor,
      ...orgCondition,
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
  const orgCondition = addOrgIdToConditions();
  const result = await AlarmSetting.findOne({
    where: {
      id: {
        [Op.lt]: id,
      },
      alarmZone,
      alarmType,
      alarmSensor,
      ...orgCondition,
    },
    order: [['id', 'DESC']],
  });

  return result?.dataValues;
};

const findByBerthId = async (berthId: number) => {
  const orgCondition = addOrgIdToConditions();
  return await AlarmSetting.findAll({
    where: {
      berthId,
      ...orgCondition,
    },
    order: [['id', 'DESC']],
  });
};

export const resetValueAlarmSetting = async (
  alarmSettingDto: AlarmSettingUpdateDto,
  t?: Transaction
) => {
  const orgCondition = addOrgIdToConditions(); // Lấy orgId động
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
        ...orgCondition,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

const createAlarmSetting = async (berthId: number, alarmSettingDto: any, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return await AlarmSetting.create(
    {
      orgId: orgCondition.orgId,
      berthId,
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
      ...orgCondition,
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
