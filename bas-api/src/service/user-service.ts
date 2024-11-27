import { BadRequestException, InternalException } from '@bas/api/errors';
import { generateJwt, generateJwtSocket, log, randomString } from '@bas/utils';
import { compressImage, deleteImage } from '@bas/utils/image';
import { REFRESH_TERM } from '@bas/config';
import { internalErrorCode } from '@bas/constant';
import { AVATAR_FOLDER_PATH_REGEX } from '@bas/constant/path';
import { baseDao, refreshTokenDao, userDao } from '@bas/database/dao';
import User, { UserInput } from '@bas/database/models/user-model';

import { UserQueryParams, UserUpdatePayload } from '@bas/service/typing';
import { removeTokenByUserId } from '@bas/database/dao/refresh-token-dao';

const DEFAULT_REFRESH_TERM = 604800000;

const createUser = async (payload: UserInput, transaction?: any) => {
  return await User.create(payload, {
    transaction,
  });
};

const updateUserInformation = async (id: string, payload: UserUpdatePayload, transaction?: any) => {
  const { email, phone, avatar } = payload;

  const user = await userDao.getOneUserById(id);
  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (!avatar && user.avatar) {
    deleteImage(user.avatar?.replace(AVATAR_FOLDER_PATH_REGEX, ''));
    payload.avatar = null;
  } else {
    // Avatar url not change
    if (avatar && user.avatar && avatar.includes(user.avatar)) {
      payload.avatar = user.avatar;
    }
  }
  await baseDao.updateModel(User, id, payload, transaction);
  return await userDao.getOneUserById(id);
};

const removeTokenByUser = async (userId: string) => {
  return await refreshTokenDao.removeTokenByUserId(userId);
};

const updateUserById = async (id: string, payload: UserUpdatePayload, transaction?: any) => {
  const { email, phone } = payload;
  // check email and phone is unique
  return baseDao.updateModel(User, id, payload, transaction);
};

const getAllUsers = async (params?: UserQueryParams) => {
  return await userDao.getAllWithParams(params);
};

const getUserById = async (id: string) => {
  return await userDao.getOneUserById(id);
};

const deleteAccountById = async (id: string) => {
  const user: User | null = await userDao.getOneUserById(id);
  if (user) {
    if (user?.avatar) {
      deleteImage(user?.avatar);
    }
  } else {
    throw new BadRequestException('User not found', internalErrorCode.RESOURCE_NOT_FOUND);
  }
  await removeTokenByUserId(id);
  return await removeTokenByUserId(id);
};

const generateAccessToken = (user: User) => {
  return generateJwt(user);
};

const generateAccessTokenForSocket = (userId: string, roleId: number, orgId: number) => {
  return generateJwtSocket(userId, roleId, orgId);
};

const generateRefreshToken = async (user: User, ipAddress: string, transaction?: any) => {
  return await refreshTokenDao.create(
    {
      token: randomString(),
      userId: user.id,
      expires: new Date(Date.now() + (REFRESH_TERM ? DEFAULT_REFRESH_TERM : +REFRESH_TERM)),
      createdByIp: ipAddress,
    },
    transaction
  );
};
const getRefreshToken = async (token: string, ip: string) => {
  const refreshToken = await refreshTokenDao.findOneByTokenAndIp(token, ip);
  console.log({ refreshToken, token, ip });
  if (!refreshToken || !refreshToken.isActive) throw new InternalException('Invalid token');
  return refreshToken;
};

const revokeToken = async (token: string, revokedByIpAddress: string) => {
  const refreshToken = await getRefreshToken(token, revokedByIpAddress);

  if (!refreshToken.user) return new InternalException('Revoke token failed');

  refreshToken.revoked = new Date();
  refreshToken.revokedByIp = revokedByIpAddress;
  await refreshToken.save();
};

const cleanupToken = async () => {
  return await refreshTokenDao.removeUnusedToken();
};

const refreshUserToken = async (token: string, ipAddress: string, transaction?: any) => {
  const refreshToken = await getRefreshToken(token, ipAddress);

  if (!refreshToken.user) throw new InternalException('Refresh token failed');

  const newRefreshToken = await generateRefreshToken(refreshToken.user, ipAddress, transaction);

  refreshToken.revoked = new Date();
  refreshToken.replaceByToken = newRefreshToken.token;
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();

  const newAccessToken = generateJwt(refreshToken.user);

  const user = await userDao.getOneUserById(refreshToken.userId);

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken.token,
    data: user,
  };
};

const findUserByRole = async (role: string) => {
  return await userDao.findUserByRole(role);
};

const getOrgInformationUser = async (userId: string) => {
  const user = await userDao.getOneUserById(userId);
  if (!user) {
    throw new BadRequestException('User not found');
  }
  return {
    name: user.orgName,
    logo: user.orgLogo,
    // ...include other organization fields if needed...
  };
};

export {
  deleteAccountById,
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  revokeToken,
  generateRefreshToken,
  generateAccessToken,
  refreshUserToken,
  cleanupToken,
  updateUserInformation,
  generateAccessTokenForSocket,
  findUserByRole,
  getOrgInformationUser,
};
