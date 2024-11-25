import { logError, logSuccess, trace, unflattenObject, verifyTokenForSocket } from '@bas/utils';
import { Namespace, Server } from 'socket.io';
import { KafkaMessage } from 'kafkajs';
import {
  berthService,
  recordHistoryService,
  recordService,
  revokeTokenService,
  userService,
} from './index';
import {
  AuthSocket,
  DeviceRealValue,
  NamespaceRealtimeSocket,
  PortEventSocketDeviceError,
  PortEventSocketEndSession,
  RawRealtimeData,
  RealtimeKafkaMessage,
  SocketRealtimeData,
  TokenData,
} from './typing';
import * as objectMapper from 'object-mapper';
import { realtimeMapper } from '@bas/database/mapper/realtime-mapper';
import { berthDao, sensorDao } from '@bas/database/dao';
import { RecordHistoryInput } from '@bas/database/models/record-history-model';
import { DeviceStatus } from '@bas/constant/device-status';
import { initKafkaData, kafkaClient } from './kafka-service';
import { BAS_DATA_REALTIME, BAS_DEVICE_REALTIME } from '@bas/constant/kafka-topic';
import { SENSOR_ERROR_CODE } from '@bas/constant';
import moment from 'moment-timezone';
import { BerthStatus } from '@bas/constant/berth-status';
import { Berth, Sensor } from '@bas/database';
import { APP_NAME, LIMIT_CONDITION, SPEED_CONDITION } from '@bas/config';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SystemRole } from '@bas/database/master-data/system-role';
import { setIntervalAsync } from 'set-interval-async';
import { AsyncContext } from '@bas/utils/AsyncContext';

const TIME_OUT = 30 * 1000;
const groupId = `GROUP-${APP_NAME}`;
let deviceRealtime = new Map<number, DeviceRealValue>();
let realtimeSocket: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> =
  null as any;
const rooms = new Set<String>();
let generalSocket: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> =
  null as any;
let berthIsRunning = new Map<
  number,
  {
    timestamp: number;
    beginTs: number;
    type: string;
    isSent: boolean;
    lostTargetAt?: number;
    mooringStatus?: string;
    orgId?: number;
  }
>();
const UUID_SYSTEM = '8dad3a21-802a-4e3d-baa3-8dd28b303a93';
/**
 * Add new berth to realtime data
 * @param berthId
 * @param orgId
 * @param leftId
 * @param rightId
 */
const addBerthRealtime = (berthId: number, orgId: number, leftId: number, rightId: number) => {
  console.log(`[addBerthRealtime] Adding berth ${berthId} to realtime data`);
  deviceRealtime.set(berthId, {
    left_sensor: {
      id: leftId,
      value: null,
      oldVal: null,
      status: DeviceStatus.DISCONNECT,
      timestamp: new Date().getTime(),
    },
    right_sensor: {
      id: rightId,
      value: null,
      oldVal: null,
      status: DeviceStatus.DISCONNECT,
      timestamp: new Date().getTime(),
    },
    berthId,
    orgId,
  });
  console.log(`[addBerthRealtime] Successfully added berth ${berthId}`);
};

/**
 * Remove berth from realtime data when berth is deleted
 * @param berthId
 *
 */
const removeBerthRealtime = (berthId: number) => {
  console.log(`[removeBerthRealtime] Removing berth ${berthId} from realtime data`);
  deviceRealtime.delete(berthId);
  console.log(`[removeBerthRealtime] Successfully removed berth ${berthId}`);
};

/**
 * Init device data for device realtime when start app
 */
const initDeviceData = async () => {
  console.log('[initDeviceData] Initializing device data');
  try {
    const data = await berthService.getAllBerthWithSensor();
    deviceRealtime.clear();
    data.forEach((berth) => {
      if (berth.leftDevice?.id && berth.rightDevice?.id) {
        deviceRealtime.set(berth.id, {
          left_sensor: {
            id: berth.leftDevice?.id,
            value: berth.leftDevice?.realValue || null,
            oldVal: berth.leftDevice?.realValue || null,
            status: berth.leftDevice?.status || DeviceStatus.DISCONNECT,
            timestamp: new Date().getTime(),
          },
          right_sensor: {
            id: berth.rightDevice?.id,
            value: berth.rightDevice?.realValue || null,
            oldVal: berth.rightDevice?.realValue || null,
            status: berth.rightDevice?.status || DeviceStatus.DISCONNECT,
            timestamp: new Date().getTime(),
          },
          berthId: berth.id,
          orgId: berth.orgId,
        });
      }
    });
    console.log(`[initDeviceData] Successfully initialized ${deviceRealtime.size} devices`);
  } catch (error) {
    console.error('[initDeviceData] Error:', error);
    throw error;
  }
};

/**
 * Authorization socket with token
 * @param socket
 * @param next
 */
const authorizationSocket = (socket: AuthSocket, next: (err?: any) => void) => {
  console.log(`[authorizationSocket] Authorizing socket ${socket.id}`);
  try {
    const token: string | undefined | string[] = socket.handshake.headers.authorization;
    if (!token) {
      return next(new Error('Token is required'));
    }
    const userInformation: TokenData | null = verifyTokenForSocket(<string>token);
    if (!userInformation) {
      return next(new Error('Token is invalid'));
    }
    socket.auth = {
      userId: userInformation.userId,
      roleId: userInformation.roleId,
      orgId: userInformation.orgId,
    };
    console.log(`[authorizationSocket] Successfully authorized socket ${socket.id}`);
    console.log('user information:', userInformation);
    next();
  } catch (error) {
    return next(new Error('Token is invalid'));
  }
};

/**
 * Get room key
 * @param berthId : string (berthId)
 * @param type : string (bas, config)
 */
const getRoomKey = (berthId: string, type: string) => {
  const key = `${type}_${berthId}`;
  console.log(`[getRoomKey] Generated key: ${key}`);
  return key;
};

/**
 * Handle join socket. if socket is not auth, disconnect socket
 * @param socket
 */
const handleJoinSocket = async (socket: AuthSocket) => {
  console.log(`[handleJoinSocket] Socket ${socket.id} joining`);
  if (!socket.auth) {
    return;
  }
  const { userId } = socket.auth;
};

/**
 * Handle realtime data when receive data from kafka and emit to socket room with berthId
 * @param realtimeSocket
 * @returns
 */
const handleRealtimeData = (realtimeSocket?: Namespace<NamespaceRealtimeSocket>) => {
  return async (message: KafkaMessage) => {
    console.log('[handleRealtimeData] Processing new message');
    try {
      const raw: RealtimeKafkaMessage = JSON.parse(message?.value?.toString() || '{}');
      console.log('[Kafka Message] Raw data:', raw);
      const objectData: SocketRealtimeData = objectMapper.merge(
        raw,
        realtimeMapper
      ) as SocketRealtimeData;
      const context = { orgId: objectData.orgId, userId: UUID_SYSTEM, roleId: 1 };
      AsyncContext.run(context, async () => {
        const room = getRoomKey(objectData.berthId.toString(), 'bas');
        const { data, record } = await processData(objectData);
        const isRunning = berthIsRunning.get(+objectData.berthId) || null;
        if (isRunning) {
          const beginTs = isRunning.beginTs;
          const type = isRunning.type;
          berthIsRunning.set(+objectData.berthId, {
            ...isRunning,
            type,
            beginTs,
            timestamp: new Date().getTime(),
            isSent: false,
            ...(!data?.error_code && {
              lostTargetAt: undefined,
              mooringStatus: undefined,
            }),
          });
        }

        if (realtimeSocket != null && data != null) {
          console.log(JSON.stringify(data));
          realtimeSocket.to(rooms.toString()).emit('data', JSON.stringify(data));
          if (data?.error_code) {
            await handleError(
              objectData.sessionId,
              objectData.berthId,
              data.error_code.toString(),
              record?.mooringStatus || 'DEPARTING'
            );
          } else {
            if (record?.mooringStatus !== 'DEPARTING') {
              const speedCondition = Object.values(data?.speed).every((val: any) => {
                if (!val?.value) {
                  return false;
                }
                return val.value < +SPEED_CONDITION;
              });
              const distanceCondition = Object.values(data?.distance).every((val: any) => {
                if (!val?.value) {
                  return false;
                }
                return val.value <= +LIMIT_CONDITION;
              });
              const isShouldEndRecording = speedCondition && distanceCondition;
              if (isShouldEndRecording) {
                const berth = await berthDao.getBerthInfo(objectData.berthId);
                shouldEndRecording({
                  berth: {
                    id: objectData.berthId,
                    name: berth?.name,
                    nameEn: berth?.nameEn,
                  },
                  sessionId: objectData.sessionId,
                });
              }
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
      logError(error);
    }
  };
};

/**
 * Init realtime data for visualizing data
 * @param io
 */
const initRealtimeData = async (io: Server) => {
  console.log('[initRealtimeData] Initializing realtime data socket');
  try {
    realtimeSocket = io.of('/bas-realtime');
    realtimeSocket.use(authorizationSocket);
    realtimeSocket.on('connection', async (socket: AuthSocket) => {
      setTimeout(function () {
        if (!socket.auth) {
          console.log(`Disconnect socket {id: ${socket?.id}`);
          socket.disconnect(true);
        }
      }, TIME_OUT);

      socket.on('join', async (data: any) => {
        try {
          const { berthId } = JSON.parse(data);
          if (!berthId) {
            return;
          }
          const stringBerthId = getRoomKey(berthId, 'bas');
          socket.join(stringBerthId);
          rooms.add(stringBerthId);
        } catch (error) {
          logError(error);
        }
      });

      socket.on('leave', async (data: any) => {
        try {
          const { berthId } = JSON.parse(data);
          if (!berthId) {
            return;
          }
          const stringBerthId = getRoomKey(berthId, 'bas');
          socket.leave(stringBerthId);
          // check socket room have socket
          const clients = await realtimeSocket.in(stringBerthId).fetchSockets();
          if (clients.length === 0) {
            rooms.delete(stringBerthId);
          }
        } catch (error) {
          logError(error);
        }
      });

      socket.on('disconnect', () => {
        socket.rooms?.forEach((room: any) => {
          socket.leave(room);
        });
      });
    });

    const consumer = kafkaClient.consumer({
      groupId,
    });
    await initKafkaData(handleRealtimeData(realtimeSocket), consumer, BAS_DATA_REALTIME);
  } catch (error) {
    logError(error);
  }
};

/**
 * Clean data before emit to socket room
 * @param data
 * @param berth
 * @returns
 */
function cleanData(data: SocketRealtimeData, berth: Berth | null) {
  console.log('[cleanData] Cleaning data for berth:', berth?.id);
  if (!berth?.leftDevice?.name || !berth?.rightDevice?.name) {
    return;
  }

  const mapData = (value: any, device: Sensor[]) => {
    const result: any = {};
    device.forEach((sensor) => {
      result[sensor.id] = value[sensor.name]?.value
        ? {
            value: value[sensor.name]?.value,
            alarm: value[sensor.name]?.alarm,
            zone: value[sensor.name]?.zone,
          }
        : null;
    });
    return result;
  };

  return {
    ...data,
    distance: mapData(data.distance, [berth?.leftDevice, berth?.rightDevice]),
    speed: mapData(data.speed, [berth?.leftDevice, berth?.rightDevice]),
    angle: data.angle?.value
      ? {
          value: data.angle?.value,
          alarm: data.angle?.alarm,
          zone: data.angle?.zone,
        }
      : null,
  };
}

/**
 * Process data and save to database, push data point to queue to handle alarm
 * @param objectData
 * @returns
 */
const processData = async (objectData: SocketRealtimeData): Promise<any> => {
  console.log(`[processData] Processing data for berth ${objectData.berthId}`);
  try {
    if (!objectData.orgId) {
      throw new Error('[ProcessData] Missing orgId in Kafka message.');
    }
    const record = await recordService.getRecordById(+objectData.sessionId);
    const berth = await berthDao.getBerthInfo(objectData.berthId);
    if (!record || !berth?.leftDevice?.name || !berth?.rightDevice?.name) {
      return null;
    }
    if (berth.orgId !== objectData.orgId) {
      throw new Error('Organization ID mismatch for the provided berthId.');
    }

    const error_code = SENSOR_ERROR_CODE?.[objectData.error_code?.toString()] || '';
    const device = errorConverter(error_code);
    const left = ['both', 'left'].includes(device.side) ? device.status : DeviceStatus.CONNECT;
    const right = ['both', 'right'].includes(device.side) ? device.status : DeviceStatus.CONNECT;

    await recordHistoryService.createRecordHistory(
      {
        leftDistance: objectData.distance[berth?.leftDevice?.name]?.value,
        rightDistance: objectData.distance[berth?.rightDevice?.name]?.value,
        leftSpeed: objectData.speed[berth?.leftDevice?.name]?.value,
        rightSpeed: objectData.speed[berth?.rightDevice?.name]?.value,
        angle: objectData?.angle?.value,
        leftStatus: left,
        rightStatus: right,
        LDistanceAlarm: objectData.distance[berth?.leftDevice?.name]?.alarm,
        RDistanceAlarm: objectData.distance[berth?.rightDevice?.name]?.alarm,
        LSpeedAlarm: objectData.speed[berth?.leftDevice?.name]?.alarm,
        RSpeedAlarm: objectData.speed[berth?.rightDevice?.name]?.alarm,
        angleAlarm: objectData.angle?.alarm,
        LSpeedZone: objectData.speed[berth?.leftDevice?.name]?.zone,
        RSpeedZone: objectData.speed[berth?.rightDevice?.name]?.zone,
        LDistanceZone: objectData.distance[berth?.leftDevice?.name]?.zone,
        RDistanceZone: objectData.distance[berth?.rightDevice?.name]?.zone,
        angleZone: objectData.angle?.zone,
        time: moment(objectData.eventTime).utc().toDate(),
        recordId: record.id,
      } as RecordHistoryInput,
      {
        left: berth.leftDevice?.id,
        right: berth.rightDevice?.id,
      },
      record?.mooringStatus || 'DEPARTING'
    );

    return {
      data: cleanData(objectData, berth),
      record,
    };
  } catch (error) {
    logError(error);
    throw error;
  }
};

/**
 * Convert error code to status and message
 * @param error : string
 *
 */
const errorConverter = (error: string) => {
  console.log(`[errorConverter] Converting error: ${error}`);
  const side = error.split('@')?.[1] || '';
  const errorMessage = error.split('@')?.[0] || '';
  switch (errorMessage) {
    case 'disconnected':
      return {
        side: side,
        status: DeviceStatus.DISCONNECT,
        message: errorMessage,
      };
    case 'lost_target':
      return {
        side: side,
        status: DeviceStatus.FAIL,
        message: errorMessage,
      };
    case 'weak_signal':
      return {
        side: side,
        status: DeviceStatus.FAIL,
        message: errorMessage,
      };
    default:
      return {
        side: 'both',
        status: DeviceStatus.CONNECT,
        message: null,
      };
  }
};

/**
 * Init socket for config popup
 * @param io
 */
const initRealtimeDevice = async (io: Server) => {
  console.log('[initRealtimeDevice] Initializing realtime device socket');
  const deviceSocket = io.of('/device-realtime');
  deviceSocket.use(authorizationSocket);
  deviceSocket.on('connection', async (socket: AuthSocket) => {
    await handleJoinSocket(socket);
    setTimeout(function () {
      if (!socket.auth) {
        console.log(`Disconnect socket {id: ${socket?.id}`);
        socket.disconnect(true);
      }
    }, TIME_OUT);

    socket.on('join', async (data: any) => {
      try {
        const { berthId } = JSON.parse(data);
        if (!berthId) {
          return;
        }
        const stringBerthId = getRoomKey(berthId, 'config');
        socket.join(stringBerthId);
        rooms.add(stringBerthId);
      } catch (error) {
        logError(error);
      }
    });

    socket.on('leave', async (data: any) => {
      try {
        const { berthId } = JSON.parse(data);
        if (!berthId) {
          return;
        }
        const stringBerthId = getRoomKey(berthId, 'config');
        socket.leave(stringBerthId);
        const clients = await deviceSocket.in(stringBerthId).fetchSockets();
        if (clients.length === 0) {
          rooms.delete(stringBerthId);
        }
      } catch (error) {
        logError(error);
      }
    });

    socket.on('disconnect', () => {
      socket.rooms?.forEach((room: any) => {
        socket.leave(room);
      });
    });
  });

  const consumer = kafkaClient.consumer({
    groupId: groupId + '-device',
  });

  await initKafkaData(
    async (message: KafkaMessage) => {
      const raw: RawRealtimeData = JSON.parse(message?.value?.toString() || '{}');
      const berthSensor = deviceRealtime.get(+raw.berthId);
      if (!berthSensor) {
        return;
      }

      const errorInfo = errorConverter(SENSOR_ERROR_CODE[raw?.error_code?.toString()] || '');

      if (raw.sensorsType !== 'RIGHT') {
        berthSensor.left_sensor = {
          ...berthSensor.left_sensor,
          oldVal: berthSensor.left_sensor.value,
          value: raw.distance || null,
          status: errorInfo.status,
          timestamp: new Date().getTime(),
          error: errorInfo.message,
        };
      } else {
        berthSensor.right_sensor = {
          ...berthSensor.right_sensor,
          oldVal: berthSensor.right_sensor.value,
          value: raw.distance || null,
          status: errorInfo.status,
          timestamp: new Date().getTime(),
          error: errorInfo.message,
        };
      }

      // Updating sensors using the new method with berthId and orgId
      await sensorDao.updatePairDevice(
        {
          id: berthSensor.left_sensor.id,
          status: berthSensor.left_sensor.status,
          value: berthSensor.left_sensor.value,
          oldVal: berthSensor.left_sensor.oldVal,
          timeout: berthSensor.left_sensor.timestamp + TIMEOUT_DEVICE < new Date().getTime(),
        },
        {
          id: berthSensor.right_sensor.id,
          status: berthSensor.right_sensor.status,
          value: berthSensor.right_sensor.value,
          oldVal: berthSensor.right_sensor.oldVal,
          timeout: berthSensor.right_sensor.timestamp + TIMEOUT_DEVICE < new Date().getTime(),
        },
        raw.berthId // Passing the berthId
      );

      deviceRealtime.set(+raw.berthId, berthSensor);

      deviceSocket
        .to(getRoomKey(raw.berthId.toString(), 'config'))
        .emit('device', JSON.stringify(deviceRealtime.get(raw.berthId)));
    },
    consumer,
    BAS_DEVICE_REALTIME
  );

  const INTERVAL_TIME = 1000;
  const TIMEOUT_DEVICE = 1000 * 30;

  setInterval(async () => {
    for (const berth of deviceRealtime.keys()) {
      const configData = deviceRealtime.get(berth);
      const orgId = configData?.orgId;
      if (orgId) {
        AsyncContext.run({ orgId, userId: UUID_SYSTEM, roleId: 8 }, async () => {
          const now = new Date().getTime();

          if (
            configData.left_sensor.timestamp + TIMEOUT_DEVICE < now &&
            configData.left_sensor.status !== DeviceStatus.DISCONNECT
          ) {
            configData.left_sensor = {
              ...configData.left_sensor,
              status: DeviceStatus.DISCONNECT,
              oldVal: configData.left_sensor.value,
              value: null,
              error: 'disconnected',
            };
          }

          if (
            configData.right_sensor.timestamp + TIMEOUT_DEVICE < now &&
            configData.right_sensor.status !== DeviceStatus.DISCONNECT
          ) {
            configData.right_sensor = {
              ...configData.right_sensor,
              status: DeviceStatus.DISCONNECT,
              oldVal: configData.right_sensor.value,
              value: null,
              error: 'disconnected',
            };
          }

          await sensorDao.updatePairDevice(
            {
              id: configData.left_sensor.id,
              status: configData.left_sensor.status,
              value: configData.left_sensor.value,
              oldVal: configData.left_sensor.oldVal,
              timeout: configData.left_sensor.timestamp + TIMEOUT_DEVICE < now,
            },
            {
              id: configData.right_sensor.id,
              status: configData.right_sensor.status,
              value: configData.right_sensor.value,
              oldVal: configData.right_sensor.oldVal,
              timeout: configData.right_sensor.timestamp + TIMEOUT_DEVICE < now,
            },
            berth // Pass the berthId
          );

          deviceRealtime.set(berth, configData);

          deviceSocket
            .to(getRoomKey(berth.toString(), 'config'))
            .emit('device', JSON.stringify(deviceRealtime.get(berth)));
        });
      }
    }
  }, INTERVAL_TIME);
};

/**
 * emit end session to socket room
 * @param portEventSocketEndSession
 */
const shouldEndRecording = (portEventSocketEndSession: PortEventSocketEndSession) => {
  console.log(
    `[shouldEndRecording] Ending session for berth ${portEventSocketEndSession.berth.id}`
  );
  generalSocket.emit('COMPLETED_SESSION', JSON.stringify(portEventSocketEndSession));
};

/**
 * Handle error from sensor
 * @param sessionId
 * @param berthId
 * @param code
 * @param mooringStatus [DEPARTING, BERTHING]
 */
const handleError = async (
  sessionId: string,
  berthId: number,
  code: string,
  mooringStatus: string
) => {
  console.log(`[handleError] Handling error for berth ${berthId}, code: ${code}`);
  try {
    const berth = await berthDao.getBerthInfo(berthId);
    if (!berth || !berth.leftDevice || !berth.rightDevice) {
      return;
    }
    const error: string = SENSOR_ERROR_CODE[code];
    const side = error.split('@')[1];
    const errorMessage = error.split('@')[0];
    let isRunning = null;
    switch (side) {
      case 'both':
        // if (['lost_target', 'disconnected'].includes(errorMessage)) {
        //   if (mooringStatus === 'DEPARTING' && errorMessage === 'lost_target') {
        //     shouldEndRecording({
        //       berth: {
        //         id: berthId,
        //         name: berth.name,
        //         nameEn: berth.nameEn,
        //       },
        //       sessionId: sessionId,
        //     });
        //   }
        //   if (mooringStatus === 'BERTHING') {
        //     deviceIsError({
        //       sessionId: sessionId,
        //       berth: {
        //         id: berthId,
        //         name: berth.name,
        //         nameEn: berth.nameEn,
        //       },
        //       errorCode: errorMessage.toUpperCase(),
        //     });
        //   }
        // }
        if (errorMessage === 'disconnected') {
          deviceIsError({
            sessionId: sessionId,
            berth: {
              id: berthId,
              name: berth.name,
              nameEn: berth.nameEn,
            },
            errorCode: errorMessage.toUpperCase(),
          });
        }

        isRunning = berthIsRunning.get(berthId) || null;
        if (errorMessage === 'lost_target') {
          if (isRunning && !isRunning?.lostTargetAt) {
            berthIsRunning.set(berthId, {
              ...isRunning,
              lostTargetAt: new Date().getTime(),
              mooringStatus: mooringStatus,
            });
          }
        } else {
          if (isRunning && isRunning?.lostTargetAt) {
            berthIsRunning.set(berthId, {
              ...isRunning,
              lostTargetAt: undefined,
              mooringStatus: undefined,
            });
          }
        }
        break;
      default:
        isRunning = berthIsRunning.get(berthId) || null;
        if (isRunning && isRunning?.lostTargetAt) {
          berthIsRunning.set(berthId, {
            ...isRunning,
            lostTargetAt: undefined,
            mooringStatus: undefined,
          });
        }
        break;
    }
  } catch (error) {
    trace(error);
    logError(error);
  }
};

/**
 * Emit device error to socket room
 * @param portEventSocketDeviceError
 */
const deviceIsError = (portEventSocketDeviceError: PortEventSocketDeviceError) => {
  console.log(`[deviceIsError] Device error for berth ${portEventSocketDeviceError.berth.id}`);
  generalSocket.emit('DEVICE_ERROR', JSON.stringify(portEventSocketDeviceError));
};

/**
 * @description Init socket for general event (device error, end session)
 * @param io
 */
const initRealtimeGeneral = async (io: Server) => {
  console.log('[initRealtimeGeneral] Initializing general realtime socket');
  generalSocket = io.of('/port-events');
  generalSocket.use(authorizationSocket);
  generalSocket.on('connection', async (socket: AuthSocket) => {
    await handleJoinSocket(socket);
    setTimeout(function () {
      if (!socket.auth) {
        console.log(`Disconnect socket {id: ${socket?.id}`);
        socket.disconnect(true);
      }
    }, TIME_OUT);
    socket.on('disconnect', () => {});
  });
};

/**
 * Watching berth to :
 * - Check berth is receiving data in 30s then send disconnect status to socket room
 * - Check berth when record time is 6 hours then finish this record
 */
const watchingBerth = async () => {
  console.log('[watchingBerth] Starting berth monitoring');
  const INTERVAL_TIME = 1000;
  const TIMEOUT = 1000 * 30;
  const TIMEOUT_RECORD = 1000 * 60 * 60 * 6;
  setIntervalAsync(async () => {
    for (const [berthId, value] of berthIsRunning) {
      const now = new Date().getTime();
      const orgId = value.orgId;
      if (orgId) {
        AsyncContext.run({ orgId, userId: UUID_SYSTEM, roleId: 8 }, async () => {
          // Check the berth is lost target more than 10s
          if (value?.lostTargetAt && value?.lostTargetAt + 10000 < now) {
            const berth = await berthDao.getBerthInfo(berthId);
            const record = await recordService.getCurrentRecord(berthId);
            if (!berth || !berth.leftDevice || !berth.rightDevice) {
              return;
            }

            if (!record) {
              return;
            }

            if (value.mooringStatus === 'DEPARTING') {
              shouldEndRecording({
                berth: {
                  id: berthId,
                  name: berth?.name,
                  nameEn: berth?.nameEn,
                },
                sessionId: record?.sessionId,
              });
            } else {
              deviceIsError({
                sessionId: record?.sessionId,
                berth: {
                  id: berthId,
                  name: berth?.name,
                  nameEn: berth?.nameEn,
                },
                errorCode: 'LOST_TARGET',
              });
            }
          }

          // Check the record for more than 6 hours
          if (value.beginTs + TIMEOUT_RECORD < now) {
            const berth = await berthDao.getBerthInfo(berthId);
            if (!berth || !berth.leftDevice || !berth.rightDevice) {
              return;
            }
            //End record
            console.log('End record: ', berthId);
            const user = await userService.findUserByRole(SystemRole.ADMIN);
            if (!user) {
              return;
            }
            const { isSync } = await berthService.resetBerth({
              berthId: berthId,
              status: BerthStatus.MOORING,
              modifier: user.id,
              isError: false,
              isFinish: true,
            });
            console.log('End record: ', isSync);
          }

          // Check the berth is receiving data in 30s
          if (value.timestamp + TIMEOUT < now && !value.isSent) {
            berthIsRunning.set(berthId, {
              ...value,
              isSent: true,
            });
            const res = await recordService.getCurrentRecord(berthId);
            if (!res) {
              return;
            }
            const record = unflattenObject(res);

            const error: string = SENSOR_ERROR_CODE[1033];
            const errorMessage = error.split('@')[0];
            const room = getRoomKey(berthId.toString(), 'bas');
            console.log('Disconnect socket room: ', room);
            if (realtimeSocket) {
              realtimeSocket.to(room.toString()).emit(
                'data',
                JSON.stringify(
                  cleanData(
                    {
                      distance: {},
                      speed: {},
                      timestamp: new Date().getTime(),
                      eventTime: moment().tz('Asia/Ho_Chi_Minh').toDate().toISOString(),
                      berthId: berthId,
                      sessionId: record.id.toString(),
                      error_code: 1033,
                      orgId: record?.orgId || null,
                    },
                    record?.berth || null
                  )
                )
              );
            }
            deviceIsError({
              sessionId: record.sessionId,
              berth: {
                id: berthId,
                name: record.berth?.name,
                nameEn: record.berth?.nameEn,
              },
              errorCode: errorMessage.toUpperCase(),
            });
          }
        });
      }
    }
  }, INTERVAL_TIME);
};

const addBerthToWatch = (berthId: number, beginTs: number, type: string) => {
  console.log(`[addBerthToWatch] Adding berth ${berthId} to watch list`);
  berthIsRunning.set(berthId, {
    timestamp: new Date().getTime(),
    beginTs,
    type,
    isSent: false,
  });
};
const removeBerthFromWatch = (berthId: number) => {
  console.log(`[removeBerthFromWatch] Removing berth ${berthId} from watch list`);
  berthIsRunning.delete(berthId);
};

const initWatchBerth = async () => {
  console.log('[initWatchBerth] Initializing berth watching');
  const records = await berthDao.getBerthsWithHaveRecording();
  console.log('Init watch berth: ', records.length);
  records.forEach((frame: any) => {
    const beginTs = new Date(frame?.startTime).getTime();
    const orgId = frame?.orgId;
    if (orgId) {
      AsyncContext.run({ orgId, userId: UUID_SYSTEM, roleId: 8 }, () => {
        addBerthToWatch(frame.berth.id, beginTs, frame.mooringStatus);
      });
    } else {
      console.warn(`[initWatchBerth] Missing orgId for berth ${frame.berth.id}`);
    }
  });
};

/**
 * Init realtime service
 * @param io
 */
const init = (io: Server) => {
  console.log('[init] Initializing realtime service');
  try {
    revokeTokenService.init();
    initRealtimeData(io).then(() => logSuccess('Init realtime data successfully'));
    initDeviceData().then(() => {
      initRealtimeDevice(io).then(() => logSuccess('Init realtime device successfully'));
    });
    initWatchBerth().then(() => watchingBerth());
    initRealtimeGeneral(io).then(() => logSuccess('Init realtime general successfully'));
    logSuccess('-----------------Init realtime service successfully-------------');
  } catch (error) {
    logError(error);
  }
};

export {
  init,
  realtimeSocket,
  shouldEndRecording,
  addBerthRealtime,
  removeBerthRealtime,
  removeBerthFromWatch,
  addBerthToWatch,
};
