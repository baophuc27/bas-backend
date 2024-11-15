import { Unauthorized } from '@bas/api/errors';
import { JWT_EXPIRES, SECRET_KEY, SOCKET_EXPIRES } from '@bas/config';
import { User } from '@bas/database/models';
import { sign, verify } from 'jsonwebtoken';
// import { User } from '@/databases';
import { UnauthorizedException } from '@bas/exceptions';

type TokenData = {
  userId: string;
  permissions: string;
  fullName: string;
  orgId: number;
  roleId: number;
  originalId: number;
};

export const generateTokenForUse = (data: any, secret?: string) => {
  // const refreshSecret = secret || crypto.randomBytes(10).toString('hex');
  const token = sign({ ...data }, SECRET_KEY, { expiresIn: JWT_EXPIRES });
  return { token };
};

export const verifyTokenForSocket = (token: string): TokenData | null => {
  try {
    const data = verify(token, SECRET_KEY);
    return data as TokenData;
  } catch (error) {
    return null;
  }
};

export const verifyToken = (token: string): TokenData => {
  try {
    const data = verify(token, SECRET_KEY);
    return data as TokenData;
  } catch (error) {
    throw new UnauthorizedException('Token expired');
  }
};

export const generateJwt = (user: User) => {
  return sign(
    {
      userId: user.id,
      originalId: user.originalId,
      roleId: user.roleId,
      fullName: user.fullName,
      permission: user.permission,
      orgId: user.orgId,
    },
    SECRET_KEY,
    {
      expiresIn: JWT_EXPIRES,
    }
  );
};

export const generateJwtSocket = (userId: string, roleId: number) => {
  return sign({ userId, roleId }, SECRET_KEY, {
    expiresIn: SOCKET_EXPIRES,
  });
};
