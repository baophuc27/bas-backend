import { Op } from 'sequelize';
import { RefreshToken, User } from '../models';
import { RefreshTokenInput, RefreshTokenOutput } from '@bas/database/models/refresh-token-model';

const create = async (
  payload: RefreshTokenInput,
  transaction?: any
): Promise<RefreshTokenOutput> => {
  return await RefreshToken.create(payload, {
    transaction: transaction,
  });
};

const findOneByTokenAndIp = async (token: string, ipAddress?: string) => {
  return RefreshToken.findOne({
    where: {
      [Op.and]: {
        token,
        expires: {
          [Op.gt]: new Date(),
        },
      },
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'roleId'],
      },
    ],
    logging: console.log,
  });
};

const removeUnusedToken = async () => {
  return await RefreshToken.destroy({
    where: {
      [Op.or]: {
        revoked: {
          [Op.not]: null,
        },
        expires: {
          [Op.lt]: new Date(),
        },
      },
    },
  });
};

const removeTokenByUserId = async (userId: string) => {
  return await RefreshToken.destroy({
    where: {
      userId,
    },
  });
};

export { create, findOneByTokenAndIp, removeUnusedToken, removeTokenByUserId };
