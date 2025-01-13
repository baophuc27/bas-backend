import { RecordFilter, RecordHistoryQueryParams } from '@bas/service/typing';
import { Berth, Record, Sensor, Vessel } from '../models';
import { FindOptions, Op, or, Transaction } from 'sequelize';
import moment from 'moment';
import { recordHistoryDao } from './index';
import { DEFAULT_AMOUNT, DEFAULT_PAGE } from '@bas/constant';
import RecordHistory from '../models/record-history-model';

const findAll = async (recordFilter: RecordFilter) => {
  const { berthId, amount, vesselId, orgId, mode, order, page, search } = recordFilter;
  let conditions: FindOptions = {
    where: {
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
  if (orgId) {
    conditions.where = { ...conditions.where, orgId };
  }
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

const remove = async (id: number, orgId: number) => {
  await recordHistoryDao.removeAllByRecord(id, orgId);
  return await Record.destroy({ where: { id, orgId }, force: true });
};

const getCurrentRecord = async (berthId: number, orgId: number, t?: Transaction) => {
  return Record.findOne({
    where: {
      berthId,
      orgId,
      endTime: null,
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
            attributes: ['id', 'berthId', 'orgId', 'name'],
          },
          {
            model: Sensor,
            required: true,
            as: 'rightDevice',
            attributes: ['id', 'berthId', 'orgId', 'name'],
          },
        ],
      },
    ],
    raw: true,
    ...(t && { transaction: t }),
  });
};

const createRecord = async (data: any, t?: Transaction) => {
  return Record.create({ ...data }, { ...(t && { transaction: t }) });
};

const endRecord = async (recordId: number, orgId: number, t?: Transaction) => {
  return Record.update(
    { endTime: moment().utc().toDate() },
    {
      where: {
        id: recordId,
        orgId: orgId,
      },
      ...(t && { transaction: t }),
    }
  );
};

const getRecordById = async (recordId: number, orgId: number) => {
  return Record.findOne({
    where: { id: recordId, orgId: orgId },
  });
};

const getRecordByIdAndNotEnd = async (recordId: number, orgId: number) => {
  return Record.findOne({
    where: {
      id: recordId,
      endTime: null,
      orgId: orgId,
    },
  });
};

const getRecordHistoryByRecordId = async (
  recordId: number,
  orgId: number,
  recordHistoryQueryParams: RecordHistoryQueryParams
) => {
  const { amount, page, order } = recordHistoryQueryParams;
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
    where: { id: recordId, orgId: orgId },
    logging: true,
  });

  const recordHistories = await RecordHistory.findAndCountAll({
    where: { recordId, orgId },
    limit: amount ?? DEFAULT_AMOUNT,
    offset: (page ?? DEFAULT_PAGE) * (amount ?? DEFAULT_AMOUNT),
    order: [['time', order?.toUpperCase() ?? 'DESC']],
  });

  return {
    record: record?.dataValues,
    recordHistories: recordHistories.rows,
    count: recordHistories.count,
  };
};

const getAggregatesByRecordId = async (recordId: number, orgId: number) => {
  const record = await Record.findOne({
    where: { id: recordId, orgId },
  });
  let aggregates;
  if (record) {
    aggregates = await recordHistoryDao.getAggregateByRecord(recordId, orgId);
  }
  return {
    aggregates: aggregates || [],
  };
};

const findAllWithoutPagination = async (recordId: number, orgId: number) => {
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
    where: { id: recordId, orgId: orgId },
    logging: true,
    attributes: {
      exclude: ['orgId']
    }
  });

  const recordHistories = await RecordHistory.findAll({
    where: { recordId, orgId },
    order: [['time', 'DESC']],
    attributes: {
      exclude: ['orgId']
    }
  });

  return {
    record: record?.dataValues,
    recordHistories: recordHistories,
  };
};

const getChartByRecordId = async (recordId: number, orgId: number) => {
  const record = await Record.findOne({
    where: { id: recordId, orgId },
  });

  let chart;
  if (record) {
    chart = await recordHistoryDao.getAllRecordHistoryByRecordId(recordId, orgId);
  }

  return {
    chart,
  };
};

const findLatestRecord = async (berthId: number, orgId: number, startTime: Date, endTime: Date) => {
  const time = moment().utc().subtract(24, 'hours').toDate();
  const start = moment(startTime).utc().toDate();
  const end = moment(endTime).utc().toDate();

  return await Record.findAll({
    where: {
      berthId,
      orgId,
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
    attributes: ['id', 'berthId', 'orgId', 'sessionId', 'startTime', 'endTime'],
    logging: console.log,
  });
};

const findRecordByIds = async (recordIds: number[], orgId: number) => {
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
      orgId: orgId,
    },
  });
};

const updateStatus = async (recordId: number, orgId: number, status: string, t?: Transaction) => {
  return Record.update(
    { syncStatus: status },
    {
      where: {
        id: recordId,
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
