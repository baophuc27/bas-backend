import { RecordFilter, RecordHistoryQueryParams } from '@bas/service/typing';
import { Berth, Record, Sensor, Vessel } from '../models';
import { FindOptions, Op, Transaction } from 'sequelize';
import moment from 'moment';
import { recordHistoryDao } from './index';
import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant';
import RecordHistory from '../models/record-history-model';
import { AsyncContext } from '@bas/utils/AsyncContext';

const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    console.warn('[RECORD] No orgId found in context, context:', context);
    throw new Error('orgId is required but not found in context');
  }
  return { orgId: context.orgId };
};

const findAll = async (recordFilter: RecordFilter) => {
  const { berthId, amount, vesselId, mode, order, page, search } = recordFilter;
  const orgCondition = addOrgIdToConditions();

  let conditions: FindOptions = {
    where: {
      ...orgCondition,
      // endTime: {
      //   [Op.not]: null,
      // },
      // Remove 'endTime' condition
    },
    include: [
      {
        model: Berth,
        required: true,
        as: 'berth',
        attributes: ['id', 'name', 'nameEn'],
        paranoid: false,
      },
      {
        model: Vessel,
        required: true,
        as: 'vessel',
        attributes: ['id', 'name', 'nameEn'],
      },
    ],
    limit: amount || DEFAULT_AMOUNT,
    offset: (page || DEFAULT_PAGE) * (amount || DEFAULT_AMOUNT),
    order: [[order || 'id', mode?.toUpperCase() || 'DESC']],
    logging: console.log,
  };

  if (berthId) {
    conditions.where = { ...conditions.where, berthId };
  }

  if (vesselId) {
    conditions.where = { ...conditions.where, vesselId };
  }

  if (search) {
    conditions.where = {
      ...conditions.where,
      [Op.or]: [
        { sessionId: { [Op.like]: `%${search}%` } },
        { mooringStatus: { [Op.like]: `%${search}%` } },
      ],
    };
  }

  return await Record.findAndCountAll(conditions);
};

const remove = async (id: number) => {
  const orgCondition = addOrgIdToConditions();
  await recordHistoryDao.removeAllByRecord(id);
  return await Record.destroy({ where: { id, ...orgCondition }, force: true });
};

const getCurrentRecord = async (berthId: number, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return Record.findOne({
    where: {
      berthId,
      endTime: null,
      ...orgCondition,
    },
    include: [
      {
        model: Berth,
        required: true,
        as: 'berth',
        include: [
          {
            model: Sensor,
            required: true,
            as: 'leftDevice',
            attributes: ['id', 'name'],
          },
          {
            model: Sensor,
            required: true,
            as: 'rightDevice',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
    raw: true,
    ...(t && { transaction: t }),
  });
};

const createRecord = async (data: any, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return Record.create({ ...data, ...orgCondition }, { ...(t && { transaction: t }) });
};

const endRecord = async (recordId: number, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return Record.update(
    { endTime: moment().utc().toDate() },
    {
      where: {
        id: recordId,
        ...orgCondition,
      },
      ...(t && { transaction: t }),
    }
  );
};

const getRecordById = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  return Record.findOne({
    where: { id: recordId, ...orgCondition },
  });
};

const getRecordByIdAndNotEnd = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  return Record.findOne({
    where: {
      id: recordId,
      endTime: null,
      ...orgCondition,
    },
  });
};

const getRecordHistoryByRecordId = async (
  recordId: number,
  recordHistoryQueryParams: RecordHistoryQueryParams
) => {
  const { amount, page, order } = recordHistoryQueryParams;
  const orgCondition = addOrgIdToConditions();
  const record = await Record.findOne({
    include: [
      {
        model: RecordHistory,
        required: false,
        as: 'recordHistory',
        attributes: [
          'id',
          'orgId',
          'time',
          'leftSpeed',
          'leftDistance',
          'rightSpeed',
          'rightDistance',
          'angle',
          'angleZone',
          'LSpeedZone',
          'RSpeedZone',
          'LDistanceZone',
          'RDistanceZone',
          'RDistanceAlarm',
          'LDistanceAlarm',
          'RSpeedAlarm',
          'LSpeedAlarm',
          'angleAlarm',
          'leftStatus',
          'rightStatus',
        ],
      },
      {
        model: Vessel,
        required: true,
        as: 'vessel',
        attributes: ['id', 'orgId', 'name', 'nameEn'],
      },
      {
        model: Berth,
        required: true,
        as: 'berth',
        attributes: ['id', 'orgId', 'name', 'nameEn'],
        paranoid: false,
      },
    ],
    where: { id: recordId, ...orgCondition },
    logging: true,
  });

  const recordHistories = await RecordHistory.findAndCountAll({
    where: { recordId, ...orgCondition },
    limit: amount || DEFAULT_AMOUNT,
    offset: (page || DEFAULT_PAGE) * (amount || DEFAULT_AMOUNT),
    order: [['time', order?.toUpperCase() || 'DESC']],
  });

  return {
    record: record?.dataValues,
    recordHistories: recordHistories.rows,
    count: recordHistories.count,
  };
};

const getAggregatesByRecordId = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  const record = await Record.findOne({
    where: { id: recordId, ...orgCondition },
  });
  let aggregates;
  if (record) {
    aggregates = await recordHistoryDao.getAggregateByRecord(recordId);
  }
  return {
    aggregates: aggregates || [],
  };
};

const findAllWithoutPagination = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  const record = await Record.findOne({
    include: [
      {
        model: RecordHistory,
        required: false,
        as: 'recordHistory',
        attributes: [
          'id',
          'time',
          'leftSpeed',
          'leftDistance',
          'rightSpeed',
          'rightDistance',
          'angle',
          'angleZone',
          'LSpeedZone',
          'RSpeedZone',
          'LDistanceZone',
          'RDistanceZone',
          'RDistanceAlarm',
          'LDistanceAlarm',
          'RSpeedAlarm',
          'LSpeedAlarm',
          'angleAlarm',
          'leftStatus',
          'rightStatus',
        ],
      },
      {
        model: Vessel,
        required: true,
        as: 'vessel',
        attributes: ['id', 'name', 'nameEn', 'code'],
      },
      {
        model: Berth,
        required: true,
        as: 'berth',
        attributes: ['id', 'name', 'nameEn'],
        paranoid: false,
      },
    ],
    where: { id: recordId, ...orgCondition },
    logging: true,
  });

  const recordHistories = await RecordHistory.findAll({
    where: { recordId, ...orgCondition },
    order: [['time', 'DESC']],
  });

  return {
    record: record?.dataValues,
    recordHistories: recordHistories,
  };
};

const getChartByRecordId = async (recordId: number) => {
  const orgCondition = addOrgIdToConditions();
  const record = await Record.findOne({
    where: { id: recordId, ...orgCondition },
  });

  let chart;
  if (record) {
    chart = await recordHistoryDao.getAllRecordHistoryByRecordId(recordId);
  }

  return {
    chart,
  };
};

const findLatestRecord = async (berthId: number, startTime: Date, endTime: Date) => {
  const orgCondition = addOrgIdToConditions();
  const time = moment().utc().subtract(24, 'hours').toDate();
  const start = moment(startTime).utc().toDate();
  const end = moment(endTime).utc().toDate();

  return await Record.findAll({
    where: {
      berthId,
      ...orgCondition,
      [Op.or]: [
        {
          endTime: null,
        },
        {
          startTime: {
            [Op.between]: [start, end],
          },
        },
        {
          endTime: {
            [Op.between]: [start, end],
          },
        },
        {
          [Op.and]: [
            {
              startTime: {
                [Op.lte]: start,
              },
            },
            {
              endTime: {
                [Op.gte]: end,
              },
            },
          ],
        },
      ],
    },
    order: [['id', 'desc']],
    attributes: ['id', 'sessionId', 'startTime', 'endTime'],
    logging: console.log,
  });
};

const findRecordByIds = async (recordIds: number[]) => {
  const orgCondition = addOrgIdToConditions();
  return await Record.findAll({
    include: [
      {
        model: Berth,
        required: true,
        as: 'berth',
        attributes: ['id', 'name', 'nameEn'],
        include: [
          {
            model: Sensor,
            required: true,
            as: 'leftDevice',
            attributes: ['id', 'name'],
          },
          {
            model: Sensor,
            required: true,
            as: 'rightDevice',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
    where: {
      id: {
        [Op.in]: recordIds,
      },
      ...orgCondition,
    },
  });
};

const updateStatus = async (recordId: number, status: string, t?: Transaction) => {
  const orgCondition = addOrgIdToConditions();
  return Record.update(
    { syncStatus: status },
    {
      where: {
        id: recordId,
        ...orgCondition,
      },
      ...(t && { transaction: t }),
    }
  );
};

export {
  findAll,
  getCurrentRecord,
  createRecord,
  endRecord,
  remove,
  getRecordById,
  findLatestRecord,
  updateStatus,
  getRecordHistoryByRecordId,
  findRecordByIds,
  getAggregatesByRecordId,
  getChartByRecordId,
  findAllWithoutPagination,
  getRecordByIdAndNotEnd,
};
