import { trace } from '@bas/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { alarmService, exportDataAlarmService } from '@bas/service';
import { BadRequestException } from '../errors';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = req.query;
    const {data, count} = await alarmService.findAll(queryParams);
    return res.success({ data, count });
  } catch (error: any) {
    trace(findAll.name);
    next(error);
  }
};

const removeAlarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const isDeleted = await alarmService.removeAlarm(+id);
    if (!isDeleted) throw new BadRequestException('Delete alarm failed');
    return res.success({}, 'Delete alarm successfully')
  } catch (error: any) {
    trace(removeAlarm.name);
    next(error);
  }
};

const removeAllAlarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted = await alarmService.removeAllAlarm();
    if (!isDeleted) throw new BadRequestException('Delete alarm failed');
    return res.success({}, 'Delete alarm successfully')
  } catch (error: any) {
    trace(removeAllAlarm.name);
    next(error);
  }
};

const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = req.query;
    const {language} = req.query
    const {data} = await alarmService.findAll({...queryParams, withoutPagination: true});
    await exportDataAlarmService.exportDataToExcel(res, data, language?.toString() || 'en');
  } catch (error: any) {
    next(error);
  }
};

export default {
  findAll,
  removeAlarm,
  removeAllAlarm,
  exportData
};
