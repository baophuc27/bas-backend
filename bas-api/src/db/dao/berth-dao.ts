import { AlarmSetting, Berth, Record, Sensor, Vessel } from '../models';
import { Op, Transaction } from 'sequelize';
import { BerthFilter } from '@bas/service/typing';
import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant/common';

export const getBerthInfo = async (id: number, orgId: number) => {
  try {
    return await Berth.findOne({
      where: { id, orgId },
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
  } catch (error) {
    console.error('Error in getBerthInfo: ', error);
    throw error;
  }
};

export const getAllBerths = async (filter: BerthFilter) => {
  return Berth.findAndCountAll({
    include: [
      {
        model: Vessel,
        as: 'vessel',
        attributes: ['id', 'code', 'name', 'nameEn'],
      },
    ],
    where: {
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

export const updateBerth = async (
  id: number,
  orgId: number,
  data: any,
  modifier: string,
  t?: Transaction
) => {
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
        orgId,
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

export const deleteBerth = async (id: number, orgId: number) => {
  return Berth.destroy({
    where: {
      id,
      orgId,
    },
  });
};

export const createBerth = async (data: any, creator: string, t?: Transaction) => {
  return Berth.create(
    {
      ...data,
      ...(data?.limitZone1 && { limitZone1: +data.limitZone1 }),
      ...(data?.limitZone2 && { limitZone2: +data.limitZone2 }),
      ...(data?.limitZone3 && { limitZone3: +data.limitZone3 }),
      status: 0,
      createdBy: creator,
    },
    {
      ...(t && { transaction: t }),
    }
  );
};

export const getAllBerthWithSensor = async () => {
  return Berth.findAll({
    where: {},
    include: [
      {
        model: Sensor,
        as: 'leftDevice',
        attributes: ['id', 'berthId', 'orgId', 'name', 'status', 'realValue'],
      },
      {
        model: Sensor,
        as: 'rightDevice',
        attributes: ['id', 'berthId', 'orgId', 'name', 'status', 'realValue'],
      },
    ],
    attributes: ['id','orgId', 'name'],
  });
};

export const getBerthsWithHaveRecording = async () => {
  return Record.findAll({
    include: [
      {
        model: Berth,
        as: 'berth',
        attributes: ['id', 'orgId', 'name'],
      },
    ],
    where: {
      endTime: null,
    },
  });
};
