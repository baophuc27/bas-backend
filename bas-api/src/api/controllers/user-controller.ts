import { NotFound } from '@bas/api/errors';
import { trace } from '@bas/utils/logger';
import { userService } from '@bas/service';
import { NextFunction, Request, Response } from 'express';
import { getSystemRoleMassage, SystemRole } from '@bas/database/master-data/system-role';

const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = Object.keys(SystemRole).map((key: string, index: number) => {
      return {
        id: index + 8,
        code: key,
        ...getSystemRoleMassage(key),
      };
    });
    return res.success({ data: roles }, 'Get all roles successfully');
  } catch (error: any) {
    trace(getRoles.name);
    next(error);
  }
};

const findAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, roleId, page, amount, mode, order } = req.query;

    const { rows, count } = await userService.getAllUsers({
      search: search?.toString(),
      page: Number(page || 0),
      amount: Number(amount || 0),
      mode: mode?.toString() === 'ASC' ? 'ASC' : 'DESC',
      order: order?.toString(),
      roleId: roleId ? Number(roleId) : undefined,
    });

    const response = {
      data: rows,
      total: count,
    };

    return res.success(response, 'Get all users successfully');
  } catch (error: any) {
    trace(findAllUser.name);
    next(error);
  }
};

const findOneUserById = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const { id } = req.params;
  //
  //   const data = await userService.getUserById(id);
  //
  //   if (!data) throw new NotFound(`There's no data with id: ${id}`);
  //
  //   // NOTE: Please do not use these lines temporarily, at least until we integrate the client's AD SSO
  //   /*
  //   const azureData = await azureService.getAzureUserById(data.azureId);
  //   if (!azureData) throw new InternalException('Azure profile does not exist');
  //   */
  //
  //   const response = {
  //     data: data,
  //   };
  //
  //   return res.success(response, 'Get user successfully');
  // } catch (error: any) {
  //   trace(findOneUserById.name);
  //   next(error);
  // }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const { azureId, roleId, email, phone, fullName } = req.body;
  //
  //   const azureUser = null;
  //
  //   if (!azureUser) throw new NotFound(`The azure account ${azureId} does not exist`);
  //
  //   if (azureId != azureUser.id)
  //     throw new InternalException(
  //       `An error occurred while adding an account to the system, please make sure the id you provided is correct`
  //     );
  //
  //   const data = await userService.createUser({
  //     azureId: azureUser.id,
  //     email: email || azureUser.mail,
  //     phone: phone || azureUser.mobilePhone,
  //     roleId,
  //     fullName: fullName || azureUser.displayName,
  //     userPrincipalName: azureUser.userPrincipalName,
  //   });
  //
  //   const response = {
  //     data: data,
  //   };
  //
  //   return res.success(response, 'Create user successfully');
  // } catch (error: any) {
  //   trace(createUser.name);
  //   next(error);
  // }
};

const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const { roleId, phone, email, fullName } = req.body;
  //
  //   const { id } = req.params;
  //
  //   const data = await userService.updateUserById(id, {
  //     roleId,
  //     phone,
  //     email,
  //     fullName,
  //   });
  //
  //   const response = {
  //     data: data,
  //   };
  //
  //   return res.success(response, 'Update user successfully');
  // } catch (error: any) {
  //   trace(updateUserById.name);
  //   next(error);
  // }
};

const deleteOneUserById = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const { id } = req.params;
  //   const { userId } = req.identification;
  //   if (userId === id)
  //     throw new BadRequestException('You cannot delete yourself');
  //   const isDeleted = await userService.deleteAccountById(id);
  //   if (!isDeleted)
  //     throw new BadRequestException('Delete user failed');
  //   return res.success({}, 'Delete user successfully');
  // } catch (error: any) {
  //   trace(deleteOneUserById.name);
  //   next(error);
  // }
};

const findMyInformation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.identification.userId;
    const data = await userService.getUserById(id);
    if (!data) throw new NotFound(`There's no data with id: ${id}`);
    const response = {
      data: data,
    };
    return res.success(response, 'Get user successfully');
  } catch (error: any) {
    trace(findOneUserById.name);
    next(error);
  }
};

const updateMyInformation = async (req: Request, res: Response, next: NextFunction) => {
  // const file: any = req.file;
  // try {
  //   const { phone, email, avatar, fullName } = req.body;
  //   const id = req.identification.userId;
  //   let payload: UserUpdatePayload = {
  //     phone,
  //     email,
  //     fullName,
  //   };
  //   payload.avatar = file?.filename ? `${AVATAR_FOLDER_PATH}/${file.filename}` : (avatar || null);
  //
  //   if (file?.filename && payload?.avatar) {
  //     compressImage(payload.avatar);
  //   }
  //
  //   const data = await userService.updateUserInformation(id, payload);
  //   const response = {
  //     data: data,
  //   };
  //   res.success(response, 'Update user successfully');
  // } catch (error: any) {
  //   // Tạm thời chưa cần chỗ này
  //   // if (file) {
  //   //   deleteImage(`${AVATAR_FOLDER_PATH}/${file.filename}`);
  //   // }
  //   console.log(error);
  //   trace(updateMyInformation.name);
  //   next(error);
  // }
};

const getSocketToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, roleId, orgId } = req.identification;
    const token = userService.generateAccessTokenForSocket(userId, roleId, orgId);
    console.log('Access token: ', token);
    return res.success({ accessToken: token }, 'Get socket token successfully');
  } catch (error: any) {
    trace(getSocketToken.name);
    next(error);
  }
};

export default {
  findAllUser,
  createUser,
  updateUserById,
  findOneUserById,
  deleteOneUserById,
  updateMyInformation,
  findMyInformation,
  getSocketToken,
  getRoles,
};
