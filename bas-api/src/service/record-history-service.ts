import { recordHistoryDao, alarmDao } from '@bas/database/dao';
import { RecordHistoryInput } from '@bas/database/models/record-history-model';
import { queueService } from './index';

const getAllRecordHistoryByRecordIds = async (recordIds: number[]) => {
  return await recordHistoryDao.getAllRecordHistoryByRecordIds(recordIds);
};

const getAllRecordHistoryBetweenTime = async (berthId: number, startTime: Date, endTime: Date) => {
  return await recordHistoryDao.getAllRecordHistoryBetweenTime(berthId, startTime, endTime);
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
