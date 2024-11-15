import { vesselDao } from '@bas/database/dao';
import { BadRequestException, InternalException } from '@bas/api/errors';
import { internalErrorCode } from '@bas/constant';
import { Transaction } from 'sequelize';


export const getVessels = async (params: any) => {
  return vesselDao.getVessels(params);
};

export const createVessel = async (payload: any, t : Transaction) => {
  return vesselDao.createVessel(payload, t);
}

export const getVesselById = async (vesselId: number | undefined) => {
  if (!vesselId) {
    throw new BadRequestException('Invalid vessel id', internalErrorCode.BAD_REQUEST);
  }
  return vesselDao.getVesselById(vesselId);
}
export const upsertVessel = async (payload: any, t ?: Transaction) => {
  return vesselDao.upsertVessel(payload, t);
}

export const updateVessel = async (vesselId: number | undefined, payload: any, t : Transaction) => {
  return (await  vesselDao.updateVessel(vesselId, payload, t))[1][0];
}