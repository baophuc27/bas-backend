import { trace } from '@bas/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { berthService } from '@bas/service';
import { BerthStatus, getBerthStatusMessages } from '@bas/constant/berth-status';
import { configurationBerth } from '@bas/service/berth-service';

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const data = await berthService.getBerthById(+id, +orgId);
    return res.success({ data });
  } catch (error: any) {
    trace(getOne.name);
    next(error);
  }
};

const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = Object.keys(BerthStatus)
      .map((item, index) => {
        return {
          id: index,
          code: item,
          ...getBerthStatusMessages(item),
        };
      })
      .flat();
    return res.success({ data });
  } catch (error: any) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search, mode, page, amount } = req.query;
    let sortMode: 'ASC' | 'DESC' | undefined = undefined;
    if (typeof mode === 'string') {
      const normalizedMode = mode.trim().toLowerCase();
      if (normalizedMode === 'asc') {
        sortMode = 'ASC';
      } else if (normalizedMode === 'desc') {
        sortMode = 'DESC';
      }
    }

    const { data, count } = await berthService.getAllBerths({
      status: Number(status) || undefined,
      search: (search as string) || undefined,
      mode: sortMode,
      amount: amount != undefined ? Number(amount) : undefined,
      page: page != undefined ? Number(page) : undefined,
    });

    return res.success({ data, count });
  } catch (error: any) {
    // Log the error for debugging
    console.error(`Error in getAll: ${error.message}`, error);
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id} = req.params;
    const { userId, orgId  } = req.identification;
    const data = await berthService.updateBerth(+id, +orgId, req.body, userId);
    return res.success({ data }, 'Berth updated successfully');
  } catch (error: any) {
    next(error);
  }
};

const updateConfigurations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId, orgId } = req.identification;
    const data = await berthService.configurationBerth(+id, +orgId, req.body, userId);
    return res.success({ data }, 'Berth configurations updated successfully');
  } catch (error: any) {
    next(error);
  }
};

const resetBerth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId, orgId } = req.identification;
    const { isError } = req.body;
    const data = await berthService.resetBerth({
      berthId: +id,
      orgId: +orgId,
      status: BerthStatus.AVAILABLE,
      modifier: userId,
      isError,
      isFinish: false,
    });
    return res.success({ data }, 'Berth reset successfully');
  } catch (error: any) {
    next(error);
  }
};

const finishSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId, orgId } = req.identification;
    const { isError } = req.body;
    const { data, isSync } = await berthService.resetBerth({
      berthId: +id,
      orgId: +orgId,
      status: BerthStatus.MOORING,
      modifier: userId,
      isError,
      isFinish: true,
    });
    return res.success({ data, isSync }, 'Session finished successfully');
  } catch (error: any) {
    next(error);
  }
};

const deleteBerth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.identification.orgId;
    const data = await berthService.deleteBerth(+id, +orgId);
    return res.success({ data }, 'Berth deleted successfully');
  } catch (error: any) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, orgId } = req.identification;

    const data = await berthService.createBerth(
      {
        ...req.body,
        leftDeviceId: 1,
        rightDeviceId: 2,
        orgId,
      },
      userId
    );
    return res.success({ data }, 'Berth created successfully');
  } catch (error: any) {
    next(error);
  }
};

export default {
  getOne,
  getStatus,
  getAll,
  update,
  updateConfigurations,
  resetBerth,
  finishSession,
  deleteBerth,
  create,
};
