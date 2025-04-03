import { trace } from '@bas/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { recordService } from '@bas/service';

const syncDataApp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await recordService.syncDataApp(req.body);
    return res.success({ data });
  } catch (error: any) {
    trace(syncDataApp.name);
    next(error);
  }
};

export default {
    syncDataApp
};