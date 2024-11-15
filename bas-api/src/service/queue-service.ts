import kue, { DoneCallback, Job } from 'kue';
import { REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@bas/config';
import { logInfo, logSuccess } from '@bas/utils/logger';
import { alarmService } from './index';
let queue: kue.Queue;

export const initQueue = () => {
  queue = kue.createQueue({
    prefix: 'alarm',
    redis: {
      host: REDIS_HOST,
      port: REDIS_PORT,
      auth : REDIS_PASSWORD,
      db: REDIS_DB
    },
  });
  logInfo('Queue is running');
  handleQueue("alarm-save", alarmService.saveAlarmFromQueue).then(r => logSuccess("Handle queue alarm-save success"));
  return queue;
}
export const pushToQueue = async (queueName: string, data: any) => {
  return queue.create(queueName, data).save();
}


export const handleQueue = async (queueName: string, handler: (data: any) => Promise<void>) => {
  queue.process(queueName, async (job: Job, done :DoneCallback) => {
    try {
      await handler(job.data);
      done();
    } catch (error) {
      done(error);
    }
  });
}