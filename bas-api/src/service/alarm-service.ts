import { alarmDao } from '@bas/database/dao';
import * as objectMapper from 'object-mapper';
import { AlarmQueryParams } from './typing';
import { NotFound } from '@bas/api/errors';
import { alarmMapper } from '@bas/database/mapper/alarm-mapper';
import { AlarmDto } from '@bas/database/dto/response/alarm-dto';
import { InternalException } from '@bas/api/errors';

const findAll = async (alarmQueryParams: AlarmQueryParams) => {
  const resultAlarm = await alarmDao.getAllAlarmByParams(alarmQueryParams);
  const recordAlarms = resultAlarm.rows.map((row) => {
    return objectMapper.merge(row.dataValues, alarmMapper) as AlarmDto;
  });

  return {
    data: recordAlarms,
    count: resultAlarm.count,
  };
};

const removeAlarm = async (id: number, orgId: number) => {
  const recordExist = await alarmDao.getAlarmById(id, orgId);
  if (!recordExist) {
    throw new NotFound('Alarm is not found');
  }
  return await alarmDao.deleteAlarmById(id, orgId);
};

const removeAllAlarm = async (orgId: number) => {
  return await alarmDao.deleteALlAlarm(orgId);
};


const saveAlarmFromQueue = async (data: any) => {
  if (data?.type === 'stop') {
    await alarmDao.endAllAlarm(data.recordId);
  } else {
    await alarmDao.createAlarmFromDataPoint(data.dataPoint, data.sensorIds);
  }
};

const findLatestAlarm = async (berthId: number, orgId: number, startTime: Date, endTime: Date) => {
  try {
    const data = await alarmDao.findLatestAlarm(berthId, orgId, startTime, endTime);
    return data.map((row) => objectMapper.merge(row.toJSON(), alarmMapper) as AlarmDto);
  } catch (error: any) {
    throw new InternalException(error.message);
  }
};

export { findAll, removeAlarm, removeAllAlarm, saveAlarmFromQueue, findLatestAlarm };
