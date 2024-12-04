import { Unauthorized } from '@bas/api/errors';
import { JWT_EXPIRES, SECRET_KEY, SOCKET_EXPIRES } from '@bas/config';
import { User } from '@bas/database/models';
import { sign, verify } from 'jsonwebtoken';
import { UnauthorizedException } from '@bas/exceptions';

type TokenData = {
  userId: string;
  roleId: number;
  orgId: number;
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
      roleId: user.roleId,
      orgId: user.orgId,
    },
    SECRET_KEY,
    {
      expiresIn: JWT_EXPIRES,
    }
  );
};

export const generateJwtSocket = (userId: string, roleId: number, orgId: number) => {
  return sign({ userId, roleId, orgId }, SECRET_KEY, {
    expiresIn: SOCKET_EXPIRES,
  });
};
