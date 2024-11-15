import { NextFunction, Request, Response } from 'express';
import { organizationDefault } from '@bas/database/master-data/organization-default';
import { APP_HOST } from '@bas/config';
import { internalErrorCode } from '@bas/constant';
import { alarmSettingService } from '@bas/service';
import InternalServerError from '../errors/internal-server-exception';
import { BadRequestException } from '../errors';

const resetAlarmSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { berthId } = req.params;
    await alarmSettingService.resetDataAlarmSetting(+berthId);

    return res.success({});
  } catch (error: any) {
    next(error);
  }
};

const getOrgInformation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      ...organizationDefault,
      logo: APP_HOST.concat(organizationDefault.logo),
    };
    return res.success({ data });
  } catch (error: any) {
    next(error);
  }
};

const uploadLogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      throw new BadRequestException('File is required', internalErrorCode.BAD_REQUEST);
    }
    return res.success({ data: file.filename });
  } catch (error: any) {
    next(error);
  }
};

export default {
  getOrgInformation,
  uploadLogo,
  resetAlarmSetting,
};
