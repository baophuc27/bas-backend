import { AlarmSetting, Berth, Record, Sensor, Vessel } from '../models';
import RecordHistory from '../models/record-history-model';
import { col, fn, Op, cast, FindOptions, QueryTypes } from 'sequelize';
import moment from 'moment/moment';
import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant';
import { alarmStatus } from '@bas/constant/alarm-status';
import sequelizeConnection from '../connection';
import { AsyncContext } from '@bas/utils/AsyncContext';

const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    console.warn('[RECORD-HISTORY] orgId is missing in AsyncContext, using default orgId.');
    // throw new Error('orgId is required but not found in context');
    return { orgId: 0 };
  }
  return { orgId: context.orgId };
};

const orgCondition = addOrgIdToConditions();

const findAllByRecord = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  return await RecordHistory.findAndCountAll({
    include: [
      {
        model: Record,
        required: true,
        as: 'record',
        attributes: [
          'id',
          'sessionId',
          'vesselId',
          'berthId',
          'mooringStatus',
          'startTime',
          'endTime',
        ],
        include: [
          {
            model: Vessel,
            required: true,
            as: 'vessel',
            attributes: ['id', 'name', 'nameEn'],
          },
          {
            model: Berth,
            required: true,
            as: 'berth',
            attributes: ['id', 'name', 'nameEn'],
            paranoid: false,
          },
        ],
      },
    ],
    where: { recordId, ...orgCondition },
    order: [['time', 'DESC']],
    logging: true,
  });
};

const createRecordHistory = async (data: any) => {
  const orgCondition = addOrgIdToConditions();
  const frame = await RecordHistory.findOrCreate({
    where: {
      recordId: data.recordId,
      time: data.time,
      ...orgCondition,
    },
    defaults: { ...data, ...orgCondition },
  });
  return frame[0];
};

const getRecordHistoryById = async (recordHistoryId: number) => {
  return RecordHistory.findOne({
    where: {
      id: recordHistoryId,
      ...orgCondition,
    },
  });
};

const removeAllAlarm = async () => {
  const orgCondition = addOrgIdToConditions();
  return await RecordHistory.destroy({
    where: {
      ...orgCondition,
      [Op.or]: [
        { RDistanceAlarm: { [Op.gt]: alarmStatus.OPERATOR } },
        { angleAlarm: { [Op.gt]: alarmStatus.OPERATOR } },
        { RSpeedAlarm: { [Op.gt]: alarmStatus.OPERATOR } },
        { LSpeedAlarm: { [Op.gt]: alarmStatus.OPERATOR } },
      ],
    },
  });
};

const getAllRecordHistoryBetweenTime = async (berthId: number, startTime: Date, endTime: Date) => {
  const orgCondition = addOrgIdToConditions();
  const start = moment(startTime).utc().toDate();
  const end = moment(endTime).utc().toDate();
  const startQuery = new Date();
  const data = await RecordHistory.findAll({
    include: [
      {
        model: Record,
        required: true,
        as: 'record',
        attributes: [
          'id',
          'sessionId',
          'vesselId',
          'berthId',
          'mooringStatus',
          'startTime',
          'endTime',
        ],
      },
    ],
    where: {
      time: { [Op.between]: [start, end] },
      '$record.berthId$': berthId,
      ...orgCondition,
    },
    order: [['time', 'DESC']],
    logging: true,
  });
  const endQuery = new Date();
  console.log('Time query:', endQuery.getTime() - startQuery.getTime(), 'ms');
  return data;
};

const removeAllByRecord = async (recordId: number) => {
  return await RecordHistory.destroy({
    where: { recordId, ...orgCondition },
  });
};

const getAllRecordHistoryByRecordIds = async (recordIds: number[]) => {
  return await RecordHistory.findAll({
    where: {
      recordId: { [Op.in]: recordIds },
      ...orgCondition,
    },
    order: [['time', 'DESC']],
  });
};

const getAggregateByRecord = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  return await RecordHistory.findAll({
    attributes: [
      [fn('round', cast(fn('max', col('angle')), 'numeric'), 2), 'maxAngle'],
      [fn('round', cast(fn('min', col('angle')), 'numeric'), 2), 'minAngle'],
      [fn('round', cast(fn('avg', col('angle')), 'numeric'), 2), 'avgAngle'],
      [fn('round', cast(fn('max', col('leftSpeed')), 'numeric'), 2), 'maxLeftSpeed'],
      [fn('round', cast(fn('min', col('leftSpeed')), 'numeric'), 2), 'minLeftSpeed'],
      [fn('round', cast(fn('avg', col('leftSpeed')), 'numeric'), 2), 'avgLeftSpeed'],
      [fn('round', cast(fn('max', col('rightSpeed')), 'numeric'), 2), 'maxRightSpeed'],
      [fn('round', cast(fn('min', col('rightSpeed')), 'numeric'), 2), 'minRightSpeed'],
      [fn('round', cast(fn('avg', col('rightSpeed')), 'numeric'), 2), 'avgRightSpeed'],
    ],
    where: { recordId, ...orgCondition },
    logging: true,
  });
};

const getAllRecordHistoryByRecordId = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  const SEQUENCE = 30;

  return await sequelizeConnection.query(
    `
      SELECT *
      FROM (
        SELECT *, row_number() OVER (ORDER BY time) AS rown
        FROM bas."RecordHistory"
        WHERE "recordId" = :recordId AND "orgId" = :orgId
      ) X
      WHERE MOD(rown, :sequence) = 1;
    `,
    {
      replacements: { recordId, orgId: orgCondition.orgId, sequence: SEQUENCE },
      type: QueryTypes.SELECT,
    }
  );
};

const removeById = async (id: number) => {
  return await RecordHistory.destroy({
    where: { id, ...orgCondition },
    force: true,
  });
};

export {
  findAllByRecord,
  createRecordHistory,
  removeAllByRecord,
  getAllRecordHistoryByRecordIds,
  getAllRecordHistoryBetweenTime,
  getAggregateByRecord,
  getAllRecordHistoryByRecordId,
  getRecordHistoryById,
  removeById,
  removeAllAlarm,
};
