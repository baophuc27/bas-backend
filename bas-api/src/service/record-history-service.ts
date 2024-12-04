import { recordHistoryDao, alarmDao } from '@bas/database/dao';
import { RecordHistoryInput } from '@bas/database/models/record-history-model';
import { queueService } from './index';
import { or } from 'sequelize';

const getAllRecordHistoryByRecordIds = async (recordIds: number[], orgId: number) => {
  return await recordHistoryDao.getAllRecordHistoryByRecordIds(recordIds, orgId);
};

const getAllRecordHistoryBetweenTime = async (berthId: number,orgId: number, startTime: Date, endTime: Date) => {
  return await recordHistoryDao.getAllRecordHistoryBetweenTime(berthId,orgId, startTime, endTime);
};
const createRecordHistory = async (
  data: RecordHistoryInput,
  sensorIds: { left: number; right: number },
  status: string
) => {
  const recordHistory = await recordHistoryDao.createRecordHistory(data);
  if (!recordHistory) {
    throw new Error('Create record history failed');
  }
  if (status !== 'DEPARTING') {
    await queueService.pushToQueue('alarm-save', { dataPoint: data, sensorIds });
  }
  return recordHistory;
};

export { createRecordHistory, getAllRecordHistoryByRecordIds, getAllRecordHistoryBetweenTime };
