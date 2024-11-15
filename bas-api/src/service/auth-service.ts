import { BadRequestException } from '@bas/exceptions';
import { dataAppService, userService } from '@bas/service';
import { userDao } from '@bas/database/dao';
import { getUserPermissions } from './permission-services';
import { getSystemPermissionsFromRoles } from './permission-services';
import { CLOUD_PERMISSION } from '@bas/constant';

export const login = async (
  username: string,
  password: string,
  ipAddress: string
): Promise<any> => {
  try {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }
    const data = await dataAppService.callLoginFunction(username, password);
    console.log('data from callLoginFunction');
    console.log(data);
    if (!data) {
      throw new BadRequestException('Invalid username or password');
    }

    const userPermissions = getUserPermissions(data.permission);

    const user = await userDao.createUsers({
      originalId: data.user.id,
      username: data.user.username,
      fullName: data.user.fullname,
      email: data.user.email,
      roleId: data.user.roleId,
      roleName: data.user.roleName,
      phone: data.user.phone,
      permission: userPermissions.systemPermissions.join(','),
      avatar: data.user.avatar,
      orgId: data.user.organization.id,
      orgName: data.user.organization.name,
      orgLogo: data.user.organization.url_logo,
    });
    console.log('user mapped info');
    console.log(user);
    if (user === null) {
      throw new BadRequestException('Invalid username or password');
    }

    const token = userService.generateAccessToken(user);
    const refreshToken = await userService.generateRefreshToken(user, ipAddress);
    return {
      token: token,
      refreshToken: refreshToken.token,
      data: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
        roleName: user.roleName,
        phone: user.phone,
        avatar: user.avatar,
        orgId: user.orgId,
        orgName: user.orgName,
        orgLogo: user.orgLogo,
        permission: userPermissions.systemPermissions.join(','),
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
