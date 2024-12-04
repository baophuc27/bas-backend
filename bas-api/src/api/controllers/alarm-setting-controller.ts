import { trace } from '@bas/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { alarmSettingService } from '@bas/service';
import { alarmStatus, getAlarmStatusMessages } from '@bas/constant/alarm-status';

const findSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { berthId } = req.params;
    const orgId = req.identification.orgId;
    const { data } = await alarmSettingService.findSetting(+berthId, +orgId);
    return res.success({ data });
  } catch (error: any) {
    trace(findSetting.name);
    next(error);
  }
};

const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alarmSettings } = req.body;
    const orgId = req.identification.orgId;
    const data = await alarmSettingService.updateSetting(alarmSettings, orgId);
    return res.success({ data }, 'Alarm setting updated successfully');
  } catch (error: any) {
    trace(updateSetting.name);
    next(error);
  }
};

const getAlarmStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = Object.keys(alarmStatus).map((key, index) => {
      return {
        id : alarmStatus[key],
        ...getAlarmStatusMessages(alarmStatus[key])
      };
    })
    return res.success({ data });
  } catch (error: any) {
    trace(alarmStatus.name);
    next(error);
  }
}

export default {
  findSetting,
  updateSetting,
  getAlarmStatus
};
