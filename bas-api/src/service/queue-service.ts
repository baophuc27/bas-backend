import kue, { DoneCallback, Job } from 'kue';
import { REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@bas/config';
import { logInfo, logSuccess } from '@bas/utils/logger';
import { alarmService } from './index';
// let queue: kue.Queue;
import Bull from 'bull';

// export const initQueue = () => {
//   queue = kue.createQueue({
//     prefix: 'alarm',
//     redis: {
//       host: REDIS_HOST,
//       port: REDIS_PORT,
//       auth : REDIS_PASSWORD,
//       db: REDIS_DB
//     },
//   });
//   logInfo('Queue is running');
//   handleQueue("alarm-save", alarmService.saveAlarmFromQueue).then(r => logSuccess("Handle queue alarm-save success"));
//   return queue;
// }
// export const pushToQueue = async (queueName: string, data: any) => {
//   return queue.create(queueName, data).save();
// }

// export const handleQueue = async (queueName: string, handler: (data: any) => Promise<void>) => {
//   queue.process(queueName, async (job: Job, done :DoneCallback) => {
//     try {
//       await handler(job.data);
//       done();
//     } catch (error) {
//       done(error);
//     }
//   });
// }

export const alarmQueue = new Bull('alarm-queue', {
  redis: {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT, 10),
    password: REDIS_PASSWORD,
    db: parseInt(REDIS_DB, 10),
  },
});

// Hàm thêm job vào hàng đợi
export const pushToQueue = async (queueName: string, data: any) => {
  try {
    console.log(`Adding job to queue: ${queueName}`);
    await alarmQueue.add(queueName, data);
  } catch (error) {
    console.error(`Failed to add job to queue: ${error}`);
  }
};

// Xử lý job trong hàng đợi
export const handleQueue = async (queueName: string, handler: (data: any) => Promise<void>) => {
  try {
    alarmQueue.process(queueName, async (job) => {
      console.log(`Processing job from queue: ${queueName}`);
      await handler(job.data);
    });
  } catch (error) {
    console.error(`Failed to process queue: ${queueName}`, error);
  }
};
