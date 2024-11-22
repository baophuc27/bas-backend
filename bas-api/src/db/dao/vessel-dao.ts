import { Vessel } from '../models';
import { Op, Transaction } from 'sequelize';
import { AsyncContext } from '@bas/utils/AsyncContext';

export const getVessels = async (params: any) => {
  return Vessel.findAll({
    where: {
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
  return Vessel.findOne({
    where: {
      id: vesselId,
    },
  });
};

export const upsertVessel = async (payload: any, t?: Transaction) => {
  console.log(payload);
  const context = AsyncContext.getContext();
  if (context && context.orgId !== undefined) {
    payload.orgId = context.orgId;
  }

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
  return Vessel.create(
    {
      ...payload,
      nameEn: payload.name,
      description: payload.description || '',
    },
    {
      transaction: t,
    }
  );
};

export const updateVessel = async (vesselId: number | undefined, payload: any, t: Transaction) => {
  return Vessel.update(
    {
      ...payload,
      nameEn: payload.name,
      description: payload.description || '',
    },
    {
      where: {
        id: vesselId,
      },
      transaction: t,
      returning: true,
    }
  );
};
