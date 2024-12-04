import { NextFunction, Request, Response } from 'express';
import { alarmService, recordHistoryService, recordService } from '@bas/service';
import { BadRequestException } from '../errors';
import moment from 'moment';
import { exportDataToExcel } from '@bas/service/export-data-record-service';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterConditions = req.query;
    const { data, count } = await recordService.findAll(filterConditions);
    return res.success({ data, count });
  } catch (error: any) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const isDeleted = await recordService.remove(+id, +orgId);
    if (!isDeleted) throw new BadRequestException('Delete record failed');
    return res.success({}, 'Delete record successfully');
  } catch (error: any) {
    next(error);
  }
};

const findAllByRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const queryParams = req.query;
    const { data, count } = await recordService.getRecordHistoryByRecordId(
      +id,
      +orgId,
      queryParams
    );
    return res.success({ success: !!(data as any)?.id, data, count });
  } catch (error: any) {
    next(error);
  }
};

const getAggregates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const { data } = await recordService.getAggregatesByRecordId(+id, +orgId);
    return res.success({ data });
  } catch (error: any) {
    next(error);
  }
};

const getChart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const { data } = await recordService.getChartByRecordId(+id, +orgId);
    return res.success({ data });
  } catch (error: any) {
    next(error);
  }
};

const findLatestRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { berthId, startTime, endTime } = req.query;
    const orgId = req.identification.orgId;
    const record = await alarmService.findLatestAlarm(
      Number(berthId),
      Number(orgId),
      moment(startTime?.toString()).toDate(),
      moment(endTime?.toString()).toDate()
    );
    return res.success({ record });
  } catch (error: any) {
    next(error);
  }
};

const exportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const { language } = req.query;
    const data = await recordService.getRecordHistoryByRecordIdWithoutPagination(+id, +orgId);
    await exportDataToExcel(res, data, language?.toString() || 'en');
  } catch (error: any) {
    next(error);
  }
};

const sync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const isSync = await recordService.sync(+id, +orgId);
    return res.success({ isSync }, 'Sync record successfully');
  } catch (error: any) {
    next(error);
  }
};

export default {
  findAll,
  remove,
  findAllByRecord,
  findLatestRecord,
  getAggregates,
  getChart,
  exportData,
  sync,
};
