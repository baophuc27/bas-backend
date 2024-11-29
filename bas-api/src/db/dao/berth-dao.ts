import { AlarmSetting, Berth, Record, Sensor, Vessel } from '../models';
import { Op, Transaction } from 'sequelize';
import { BerthFilter } from '@bas/service/typing';
import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant/common';
import { AsyncContext } from '@bas/utils/AsyncContext';

export const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    console.warn('[Berth-DAO] No orgId found in context.');
    // throw new Error('orgId is required but not found in context');
    return { orgId: 0 };
  }
  return { orgId: context.orgId };
};

const orgCondition = addOrgIdToConditions();

export const getBerthInfo = async (id: number) => {
  const orgCondition = addOrgIdToConditions();
  return Berth.findOne({
    where: {
      id,
      ...orgCondition,
    },
    include: [
      {
        model: Vessel,
        as: 'vessel',
        attributes: ['id', 'name', 'code', 'nameEn'],
      },
      {
        model: Sensor,
        as: 'leftDevice',
        attributes: ['id', 'name', 'status', 'realValue'],
      },
      {
        model: Sensor,
        as: 'rightDevice',
        attributes: ['id', 'name', 'status', 'realValue'],
      },
    ],
  });
};

export const getAllBerths = async (filter: BerthFilter) => {
  const orgCondition = addOrgIdToConditions();
  return Berth.findAndCountAll({
    include: [
      {
        model: Vessel,
        as: 'vessel',
        attributes: ['id', 'code', 'name', 'nameEn'],
      },
    ],
    where: {
      ...orgCondition,
      ...(filter?.status && { status: filter.status }),
      ...(filter?.search && {
        [Op.or]: [
          { name: { [Op.like]: `%${filter.search}%` } },
          { nameEn: { [Op.like]: `%${filter.search}%` } },
        ],
      }),
    },
    ...(filter?.page !== undefined &&
      filter?.amount !== undefined && {
        limit: filter.amount || DEFAULT_AMOUNT,
        offset: (filter.page ?? DEFAULT_PAGE) * (filter.amount ?? DEFAULT_AMOUNT),
      }),
    order: [[filter?.order || 'id', filter?.mode?.toUpperCase() || 'DESC']],
  });
};

export const updateBerth = async (id: number, data: any, modifier: string, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return Berth.update(
    {
      ...data,
      ...(data?.limitZone1 && { limitZone1: +data.limitZone1 }),
      ...(data?.limitZone2 && { limitZone2: +data.limitZone2 }),
      ...(data?.limitZone3 && { limitZone3: +data.limitZone3 }),
      modifiedBy: modifier,
    },
    {
      where: {
        id,
        ...orgCondition,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

export const deleteBerth = async (id: number) => {
  const orgCondition = addOrgIdToConditions();
  return Berth.destroy({
    where: {
      id,
      ...orgCondition,
    },
  });
};

export const createBerth = async (data: any, creator: string, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return Berth.create(
    {
      ...data,
      ...(data?.limitZone1 && { limitZone1: +data.limitZone1 }),
      ...(data?.limitZone2 && { limitZone2: +data.limitZone2 }),
      ...(data?.limitZone3 && { limitZone3: +data.limitZone3 }),
      status: 0,
      createdBy: creator,
      orgId: orgCondition.orgId,
    },
    {
      ...(t && { transaction: t }),
    }
  );
};

export const getAllBerthWithSensor = async () => {
  const orgCondition = addOrgIdToConditions();
  return Berth.findAll({
    where: {
      ...orgCondition,
    },
    include: [
      {
        model: Sensor,
        as: 'leftDevice',
        attributes: ['id', 'name', 'status', 'realValue'],
      },
      {
        model: Sensor,
        as: 'rightDevice',
        attributes: ['id', 'name', 'status', 'realValue'],
      },
    ],
    attributes: ['id', 'name'],
  });
};

export const getBerthsWithHaveRecording = async () => {
  const orgCondition = addOrgIdToConditions();
  return Record.findAll({
    include: [
      {
        model: Berth,
        as: 'berth',
        attributes: ['id', 'name'],
        where: { ...orgCondition },
      },
    ],
    where: {
      endTime: null,
    },
  });
};
