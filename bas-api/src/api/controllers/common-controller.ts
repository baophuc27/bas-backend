import { NextFunction, Request, Response } from 'express';
import { organizationDefault } from '@bas/database/master-data/organization-default';
import { APP_HOST } from '@bas/config';
import { internalErrorCode } from '@bas/constant';
import { alarmSettingService } from '@bas/service';
import { BadRequestException } from '../errors';
import { getFromCache } from '@bas/utils/cache';

const resetAlarmSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { berthId } = req.params;
    const orgId = req.identification.orgId;
    await alarmSettingService.resetDataAlarmSetting(+berthId, orgId);

    return res.success({});
  } catch (error: any) {
    next(error);
  }
};

const getOrgInformation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.identification?.orgId;
    if (!orgId) {
      throw new Error('User ID is missing or user is not authenticated');
    }

    const cachedData = await getFromCache(orgId.toString());
    if (!cachedData) {
      const data = {
        ...organizationDefault,
        logo: APP_HOST.concat(organizationDefault.logo),
      };
      console.log('Using default organization');
      return res.success({ data });
    }

    const organization = cachedData.user.organization;
    const data = {
      name: organization.nameVi,
      nameEn: organization.name,
      address: organization.address,
      description: organization.description,
      logo: organization.url_logo || organizationDefault.logo,
    };
    console.log('Using organization from cache');
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
