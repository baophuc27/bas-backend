import { trace } from '@bas/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { alarmService, exportDataAlarmService } from '@bas/service';
import { BadRequestException } from '../errors';
import { or } from 'sequelize';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = req.query;
    const { orgId } = req.identification;
    queryParams.orgId = orgId.toString();
    const { data, count } = await alarmService.findAll(queryParams);
    return res.success({ data, count });
  } catch (error: any) {
    trace(findAll.name);
    next(error);
  }
};

const removeAlarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { orgId } = req.identification;
    const isDeleted = await alarmService.removeAlarm(+id, +orgId);
    if (!isDeleted) throw new BadRequestException('Delete alarm failed');
    return res.success({}, 'Delete alarm successfully');
  } catch (error: any) {
    trace(removeAlarm.name);
    next(error);
  }
};

const removeAllAlarm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    // const { berthId } = req.query;
    // if (!berthId) throw new BadRequestException('BerthId is required');
    const isDeleted = await alarmService.removeAllAlarm(+orgId);
    if (!isDeleted) throw new BadRequestException('Delete alarm failed');
    return res.success({}, 'Delete alarm successfully');
  } catch (error: any) {
    trace(removeAllAlarm.name);
    next(error);
  }
};

const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = req.query;
    const { language } = req.query;
    const combinedQuery = { ...queryParams, withoutPagination: true };
    const { data } = await alarmService.findAll(combinedQuery);
    await exportDataAlarmService.exportDataToExcel(res, data, language?.toString() || 'en');
  } catch (error: any) {
    next(error);
  }
};

export default {
  findAll,
  removeAlarm,
  removeAllAlarm,
  exportData,
};
