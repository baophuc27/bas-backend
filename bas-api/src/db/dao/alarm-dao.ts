import RecordHistory, { RecordHistoryInput } from '../models/record-history-model';
import { Alarm, Berth, Record, Sensor } from '../models';
import { Op, Transaction, Sequelize } from 'sequelize';
import { AlarmQueryParams, createAlarmPayload } from '@bas/service/typing';
import { alarmStatus } from '@bas/constant';
import { sequelizeConnection } from '../index';
import { InternalException } from '@bas/api/errors';
import { AsyncContext } from '@bas/utils/AsyncContext';

const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    console.warn('[ALARM] No orgId found in context.');
    // throw new Error('orgId is required but not found in context');
    return { orgId: 0 };
  }
  return { orgId: context.orgId };
};

const orgCondition = addOrgIdToConditions();

const SIDE = {
  LEFT: 1,
  RIGHT: 2,
};

export const getAlarmTypeLatest = async (
  recordId: number,
  type: string,
  alarm: number,
  side?: number | null,
  t?: Transaction
): Promise<any> => {
  const alarmTypeSameLatest = await Alarm.findOne({
    where: {
      ...orgCondition,
      type,
      alarm,
      side,
      // endTime: null,
      '$record.id$': recordId,
    },
    include: [
      {
        model: Record,
        as: 'record',
      },
    ],
    ...(t && { transaction: t }),
    order: [['startTime', 'DESC']],
  });

  return alarmTypeSameLatest?.toJSON() || null;
};

export const doneAlarmTypeLatest = async (
  recordId: number,
  type: string,
  side?: number | null,
  t?: Transaction
): Promise<any> => {
  const alarmTypeSameLatest = await Alarm.findOne({
    where: {
      ...orgCondition,
      type,
      side,
      // endTime: null,
      '$record.id$': recordId,
    },
    include: [
      {
        model: Record,
        as: 'record',
      },
    ],
    order: [['startTime', 'DESC']],
    ...(t && { transaction: t }),
  });
  if (alarmTypeSameLatest) {
    alarmTypeSameLatest.endTime = new Date();
    await alarmTypeSameLatest.save({
      ...(t && { transaction: t }),
    });
  }
};

export const createRecordAlarm = async (
  recordAlarm: createAlarmPayload,
  t?: Transaction
): Promise<any> => {
  try {
    const orgCondition = addOrgIdToConditions();
    const recordHistoryItem = await getAlarmTypeLatest(
      recordAlarm.recordId,
      recordAlarm.type,
      recordAlarm.alarm,
      recordAlarm.side,
      t
    );
    if (recordHistoryItem) {
      return;
    }

    await doneAlarmTypeLatest(recordAlarm.recordId, recordAlarm.type, recordAlarm.side, t);
    return await Alarm.create(
      {
        orgId: orgCondition.orgId,
        startTime: new Date(),
        recordId: recordAlarm.recordId,
        value: recordAlarm.value,
        alarm: recordAlarm.alarm,
        zone: recordAlarm.zone,
        side: recordAlarm.side,
        type: recordAlarm.type,
        sensorId: recordAlarm.sensorId,
      },
      {
        ...(t && { transaction: t }),
      }
    );
  } catch (e: any) {
    console.log(e);
    return null;
  }
};

export const createAlarmFromDataPoint = async (
  data: RecordHistoryInput,
  sensorIds: { left: number; right: number }
) => {
  try {
    const orgCondition = addOrgIdToConditions();
    const record = await Record.findOne({
      where: {
        id: +data.recordId,
      },
    });

    if (record?.doneAlarm) {
      return;
    }

    if (data.angleAlarm && data.angleAlarm > alarmStatus.OPERATOR) {
      await createRecordAlarm({
        orgId: orgCondition.orgId,
        message: undefined,
        zone: data.angleZone,
        recordId: data.recordId,
        type: 'angle',
        alarm: data.angleAlarm,
        side: null,
        value: data.angle,
        startTime: data.time,
        sensorId: null,
      });
    } else {
      await doneAlarmTypeLatest(data.recordId, 'angle', null);
    }

    if (data.LDistanceAlarm && data.LDistanceAlarm > alarmStatus.WARNING) {
      await createRecordAlarm({
        orgId: orgCondition.orgId,
        message: undefined,
        zone: data.LDistanceZone,
        recordId: data.recordId,
        type: 'distance',
        alarm: data.LDistanceAlarm,
        side: SIDE.LEFT,
        value: data.leftDistance,
        startTime: data.time,
        sensorId: sensorIds.left,
      });
    } else {
      await doneAlarmTypeLatest(data.recordId, 'distance', SIDE.LEFT);
    }

    if (data.LSpeedAlarm && data.LSpeedAlarm > alarmStatus.OPERATOR) {
      await createRecordAlarm({
        orgId: orgCondition.orgId,
        message: undefined,
        zone: data.LSpeedZone,
        recordId: data.recordId,
        type: 'speed',
        alarm: data.LSpeedAlarm,
        side: SIDE.LEFT,
        value: data.leftSpeed,
        startTime: data.time,
        sensorId: sensorIds.left,
      });
    } else {
      await doneAlarmTypeLatest(data.recordId, 'speed', SIDE.LEFT);
    }

    if (data.RDistanceAlarm && data.RDistanceAlarm > alarmStatus.WARNING) {
      await createRecordAlarm({
        orgId: orgCondition.orgId,
        message: undefined,
        zone: data.RDistanceZone,
        recordId: data.recordId,
        type: 'distance',
        alarm: data.RDistanceAlarm,
        side: SIDE.RIGHT,
        value: data.rightDistance,
        startTime: data.time,
        sensorId: sensorIds.right,
      });
    } else {
      await doneAlarmTypeLatest(data.recordId, 'distance', SIDE.RIGHT);
    }

    if (data.RSpeedAlarm && data.RSpeedAlarm > alarmStatus.OPERATOR) {
      await createRecordAlarm({
        orgId: orgCondition.orgId,
        message: undefined,
        zone: data.RSpeedZone,
        recordId: data.recordId,
        type: 'speed',
        alarm: data.RSpeedAlarm,
        side: SIDE.RIGHT,
        value: data.rightSpeed,
        startTime: data.time,
        sensorId: sensorIds.right,
      });
    } else {
      await doneAlarmTypeLatest(data.recordId, 'speed', SIDE.RIGHT);
    }
  } catch (e: any) {
    console.log(e);
  }
};

export const getAlarmById = async (id: number) => {
  return await Alarm.findOne({
    where: {
      id,
      ...orgCondition,
    },
  });
};

export const deleteAlarmById = async (id: number) => {
  const orgCondition = addOrgIdToConditions();
  return await Alarm.destroy({
    where: {
      id,
      ...orgCondition,
    },
    force: true,
  });
};

export const deleteALlAlarm = async () => {
  const orgCondition = addOrgIdToConditions();
  return await Alarm.destroy({
    where: {
      ...orgCondition,
    },
    force: true,
  });
};

export const getAllAlarmByParams = async (params: AlarmQueryParams) => {
  const { berth, type, alarm, search, page, amount, order, mode } = params;

  const orgCondition = addOrgIdToConditions();

  const whereConditions: any = {
    ...orgCondition,
  };

  if (berth) {
    whereConditions['$record.berthId$'] = berth;
  }

  if (type) {
    whereConditions.type = type;
  }

  if (alarm) {
    whereConditions.alarm = +alarm;
  }

  if (search) {
    whereConditions[Op.or] = [
      { '$sensor.name$': { [Op.like]: `%${search}%` } },
      Sequelize.where(Sequelize.cast(Sequelize.col('zone'), 'TEXT'), {
        [Op.like]: `%${search}%`,
      }),
      { '$record.sessionId$': { [Op.like]: `%${search}%` } },
    ];
  }

  const joinConditions = [
    {
      model: Record,
      required: true,
      as: 'record',
      attributes: ['id', 'startTime', 'endTime', 'berthId', 'sessionId'],
      include: [
        {
          model: Berth,
          required: true,
          as: 'berth',
          attributes: ['id', 'name', 'nameEn'],
        },
      ],
    },
    {
      model: Sensor,
      required: true,
      as: 'sensor',
      attributes: ['id', 'name'],
    },
  ];

  let orderConditions: any = [[order ?? 'id', mode?.toUpperCase() ?? 'DESC']];

  if (order === 'sessionId') {
    orderConditions = [[{ model: Record, as: 'record' }, order, mode?.toUpperCase() ?? 'DESC']];
  }

  if (order === 'berth.nameEn') {
    orderConditions = [
      [
        { model: Record, as: 'record' },
        { model: Berth, as: 'berth' },
        'nameEn',
        mode?.toUpperCase() ?? 'DESC',
      ],
    ];
  }

  if (order === 'berth.name') {
    orderConditions = [
      [
        { model: Record, as: 'record' },
        { model: Berth, as: 'berth' },
        'name',
        mode?.toUpperCase() ?? 'DESC',
      ],
    ];
  }

  return await Alarm.findAndCountAll({
    attributes: [
      'id',
      'recordId',
      'endTime',
      'alarm',
      'side',
      'startTime',
      'type',
      'value',
      'zone',
      [
        Sequelize.literal(`(
      SELECT "message"
      FROM bas."AlarmSetting"
      WHERE
        bas."AlarmSetting"."alarmZone" = CONCAT('zone_', "Alarm"."zone")
        AND bas."AlarmSetting"."berthId" = "record"."berthId"
        AND bas."AlarmSetting"."alarmType" = "Alarm"."type"
        AND bas."AlarmSetting"."statusId" = "Alarm"."alarm"
        AND bas."AlarmSetting"."alarmSensor" = (
          CASE
            WHEN "Alarm"."side" = 1 THEN 'left_sensor'
            WHEN "Alarm"."side" = 2 THEN 'right_sensor'
            ELSE NULL
          END
        )
    )`),
        'message',
      ],
    ],
    where: whereConditions,
    include: joinConditions,
    limit: amount || 10,
    offset: (page || 0) * (amount || 10),
    order: orderConditions,
  });
};

export const endAllAlarm = async (recordId: number, t?: Transaction) => {
  await Record.update(
    {
      doneAlarm: true,
    },
    {
      where: {
        id: recordId,
      },
      ...(t && { transaction: t }),
    }
  );

  return await Alarm.update(
    {
      endTime: new Date(),
    },
    {
      where: {
        recordId,
        // endTime: null,
      },
      ...(t && { transaction: t }),
    }
  );
};
export const findLatestAlarm = async (berthId: number, startTime: Date, endTime: Date) => {
  try {
    const orgCondition = addOrgIdToConditions();
    const data = await Alarm.findAll({
      where: {
        ...orgCondition,
        startTime: {
          [Op.gte]: startTime,
          [Op.lte]: endTime,
        },
        '$record.berthId$': berthId,
      },
      include: [
        {
          model: Record,
          as: 'record',
        },
      ],
      order: [['startTime', 'DESC']],
    });
    return data;
  } catch (error: any) {
    throw new InternalException(error.message);
  }
};
