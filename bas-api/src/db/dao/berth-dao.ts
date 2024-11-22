import { AlarmSetting, Berth, Record, Sensor, Vessel } from '../models';
import { Op, Transaction } from 'sequelize';
import { BerthFilter } from '@bas/service/typing';
import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant/common';
import { AsyncContext } from '@bas/utils/AsyncContext';

// Hàm lấy orgId từ AsyncContext với fallback
const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    console.warn('[addOrgIdToConditions] No orgId found in context, applying default.');
    return {}; // Không áp dụng điều kiện orgId nếu thiếu context
  }
  return { orgId: context.orgId };
};

// Hàm lấy thông tin Berth theo ID
export const getBerthInfo = async (id: number) => {
  return Berth.findOne({
    where: {
      id,
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

// Hàm lấy danh sách tất cả các Berth với điều kiện lọc
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
      ...orgCondition, // Áp dụng điều kiện orgId
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

// Hàm cập nhật thông tin Berth
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
        ...orgCondition, // Áp dụng điều kiện orgId
      },
      ...(t && { transaction: t }),
      returning: true,
    }
  );
};

// Hàm xóa Berth theo ID
export const deleteBerth = async (id: number) => {
  const orgCondition = addOrgIdToConditions();

  return Berth.destroy({
    where: {
      id,
      ...orgCondition, // Áp dụng điều kiện orgId
    },
  });
};

// Hàm tạo mới Berth
export const createBerth = async (data: any, creator: string, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();

  return Berth.create(
    {
      ...data,
      ...(data?.limitZone1 && { limitZone1: +data.limitZone1 }),
      ...(data?.limitZone2 && { limitZone2: +data.limitZone2 }),
      ...(data?.limitZone3 && { limitZone3: +data.limitZone3 }),
      status: 'AVAILABLE',
      createdBy: creator,
    },
    {
      ...(t && { transaction: t }),
      where: { ...orgCondition }, // Áp dụng điều kiện orgId
    }
  );
};

// Hàm lấy tất cả Berth kèm theo Sensor
export const getAllBerthWithSensor = async () => {
  return Berth.findAll({
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

// Hàm lấy các Berth đang ghi nhận
export const getBerthsWithHaveRecording = async () => {
  const orgCondition = addOrgIdToConditions();

  return Record.findAll({
    include: [
      {
        model: Berth,
        as: 'berth',
        attributes: ['id', 'name'],
        where: orgCondition, // Áp dụng điều kiện orgId
      },
    ],
    where: {
      endTime: null,
    },
  });
};
