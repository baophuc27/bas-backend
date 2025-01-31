import { NextFunction, Request, Response } from 'express';
import { trace } from '@bas/utils/logger';
import { dataAppService } from '@bas/service';
import {
  generateUniqueDataAppCode,
  createDataApp,
  getActiveDataApps,
  getDataAppInfo,
  getAllDataApps,
  updateDataApp,
  deleteDataApp,
  updateDataAppStatus
} from '@bas/database/dao/data-app-dao';

const getAvailableCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    const code = await generateUniqueDataAppCode(+orgId);
    return res.success({ data: { code } });
  } catch (error: any) {
    trace(getAvailableCode.name);
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search, mode, page, amount, order } = req.query;
    const { orgId } = req.identification;

    let sortMode: 'ASC' | 'DESC' | undefined = undefined;
    if (typeof mode === 'string') {
      const normalizedMode = mode.trim().toLowerCase();
      if (normalizedMode === 'asc') {
        sortMode = 'ASC';
      } else if (normalizedMode === 'desc') {
        sortMode = 'DESC';
      }
    }

    const { rows: data, count } = await getAllDataApps({
      orgId: +orgId,
      status: status as string,
      search: search as string,
      page: page !== undefined ? Number(page) : undefined,
      amount: amount !== undefined ? Number(amount) : undefined,
      order: order as string,
      mode: sortMode
    });

    return res.success({ data, count });
  } catch (error: any) {
    trace(getAll.name);
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    const { code, ...data } = req.body;

    const newDataApp = await createDataApp(code, +orgId, data);
    return res.success({ data: newDataApp }, 'Data app created successfully');
  } catch (error: any) {
    trace(create.name);
    next(error);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    const { code } = req.params;
    
    const data = await getDataAppInfo(code, +orgId);
    return res.success({ data });
  } catch (error: any) {
    trace(getOne.name);
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    const { code } = req.params;
    const data = await updateDataApp(code, +orgId, req.body);
    return res.success({ data }, 'Data app updated successfully');
  } catch (error: any) {
    trace(update.name);
    next(error);
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    const { code } = req.params;

    const data = await deleteDataApp(code, +orgId);
    return res.success({ data }, 'Data app deleted successfully');
  } catch (error: any) {
    trace(deleteOne.name);
    next(error);
  }
};

const getActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    const data = await getActiveDataApps(+orgId);
    return res.success({ data });
  } catch (error: any) {
    trace(getActive.name);
    next(error);
  }
};

const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    const { code } = req.params;
    const { status } = req.body;

    const data = await updateDataAppStatus(code, +orgId, status);
    return res.success({ data }, 'Status updated successfully');
  } catch (error: any) {
    trace(updateStatus.name);
    next(error);
  }
};

export default {
  getAvailableCode,
  getAll,
  create,
  getOne,
  update,
  deleteOne,
  getActive,
  updateStatus
};