import { trace } from '@bas/utils/logger';
import { harborService } from '@bas/service';
import { NextFunction, Request, Response } from 'express';

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req;
    const data = await harborService.getHarborInfo(orgId!);
    return res.success({ data });
  } catch (error: any) {
    trace(getOne.name);
    next(error);
  }
};

const configuration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId, body } = req;
    const data = await harborService.configuration(orgId!, body);
    return res.success({ data });
  } catch (error: any) {
    trace(configuration.name);
    next(error);
  }
};

export default {
  getOne,
  configuration,
};
