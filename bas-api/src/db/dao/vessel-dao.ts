import { Vessel } from '../models';
import { Op, Transaction } from 'sequelize';
import { AsyncContext } from '@bas/utils/AsyncContext';

const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    throw new Error('[VesselDAO] orgId is missing in AsyncContext');
  }
  return { orgId: context.orgId };
};

export const getVessels = async (params: any) => {
  const orgCondition = addOrgIdToConditions();

  return Vessel.findAll({
    where: {
      ...orgCondition,
      ...(params?.search && {
        [Op.or]: [
          { name: { [Op.iLike]: `%${params.search}%` } },
          { nameEn: { [Op.iLike]: `%${params.search}%` } },
        ],
      }),
    },
    ...(params.page != undefined && params.amount
      ? {
          limit: params.amount || 10,
          offset: params.page ? (params.page - 1) * (params.amount || 10) : 0,
        }
      : undefined),
    logging: console.log,
  });
};

export const getVesselById = async (vesselId: number) => {
  const orgCondition = addOrgIdToConditions();

  return Vessel.findOne({
    where: {
      id: vesselId,
      ...orgCondition,
    },
  });
};

export const upsertVessel = async (payload: any, t?: Transaction) => {
  console.log(payload);
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    throw new Error('[VesselDAO] orgId is missing in AsyncContext');
  }
  payload.orgId = context.orgId;

  return Vessel.upsert(
    {
      ...payload,
      nameEn: payload.name,
      name: payload.name,
      longitude: payload?.longitude ? payload?.longitude?.toFixed(6) : null,
      latitude: payload?.latitude ? payload?.latitude?.toFixed(6) : null,
    },
    {
      ...(t && { transaction: t }),
      returning: true,
      conflictFields: ['code'],
    }
  );
};

export const createVessel = async (payload: any, t: Transaction) => {
  const orgCondition = addOrgIdToConditions();

  return Vessel.create(
    {
      ...payload,
      orgId: orgCondition.orgId,
      nameEn: payload.name,
      description: payload.description || '',
    },
    {
      transaction: t,
    }
  );
};

export const updateVessel = async (vesselId: number | undefined, payload: any, t: Transaction) => {
  const orgCondition = addOrgIdToConditions();

  return Vessel.update(
    {
      ...payload,
      nameEn: payload.name,
      description: payload.description || '',
    },
    {
      where: {
        id: vesselId,
        ...orgCondition,
      },
      transaction: t,
      returning: true,
    }
  );
};
