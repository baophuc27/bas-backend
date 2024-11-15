import { getIpAddress, logError, setCookieRefreshToken } from '@bas/utils';
import { accountDao } from '@bas/database/dao';

import bcrypt from 'bcrypt';
import UnauthorizedException from '@bas/api/errors/unauthorized-exception';
import { userService } from './index';
import { SystemRole } from '@bas/database/master-data';
import { roleMatrix } from '@bas/constant/role-matrix';

const authenticate = async (username: string, password: string, ipAddress : string) => {

  const account = await accountDao.getAccountByUsername(username);
  if (account == null) {
    throw new UnauthorizedException('Username or password is invalid');
  }

  const checkPassword = account && (await bcrypt.compare(password, account.passwordHash));
  if (!checkPassword) {
    throw new UnauthorizedException('Username or password is invalid');
  }
  const user = await userService.getUserById(account.userId);
  if (!user) {
    throw new UnauthorizedException('Username or password is invalid');
  }
  const accessToken = userService.generateAccessToken(user);
  const refreshToken = await userService.generateRefreshToken(user, ipAddress);
  const defaultRoles = Object.values(SystemRole);
  const roleCode = defaultRoles[user.roleId - 1];

  return {
    user,
    permissions: roleMatrix[roleCode.toString()].map((permission: string) => permission),
    accessToken,
    refreshToken: refreshToken.token
  };
};

export { authenticate };
