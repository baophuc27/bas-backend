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
import { initKafkaData, kafkaClient, createConsumer } from './kafka-service';
import { BAS_DATA_REALTIME, BAS_DEVICE_REALTIME } from '@bas/constant/kafka-topic';
import { SENSOR_ERROR_CODE } from '@bas/constant';
import moment from 'moment-timezone';
import { BerthStatus } from '@bas/constant/berth-status';
import { Berth, Sensor } from '@bas/database';
import { APP_NAME, LIMIT_CONDITION, SPEED_CONDITION } from '@bas/config';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SystemRole } from '@bas/database/master-data/system-role';
import { setIntervalAsync } from 'set-interval-async';
import { initQueue } from './queue-service';

const TIME_OUT = 30 * 1000;
const groupId = `GROUP-${APP_NAME}-${Date.now()}`;
let deviceRealtime = new Map<string, DeviceRealValue>();
let realtimeSocket: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> =
  null as any;
const rooms = new Set<String>();
let generalSocket: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> =
  null as any;
let berthIsRunning = new Map<
  string,
  {
    timestamp: number;
    beginTs: number;
    type: string;
    isSent: boolean;
    lostTargetAt?: number;
    mooringStatus?: string;
  }
>();
const generateKey = (berthId: number, orgId: number): string => {
  return `${berthId}-${orgId}`;
};
const UUID_SYSTEM = '8dad3a21-802a-4e3d-baa3-8dd28b303a93';
/**
 * Add new berth to realtime data
 * @param berthId
 * @param orgId
 * @param leftId
 * @param rightId
 */
const addBerthRealtime = (berthId: number, orgId: number, leftId: number, rightId: number) => {
  const key = generateKey(berthId, orgId);
  deviceRealtime.set(key, {
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
};
/**
 * Generate socket access token
 * @param userId
 * @param roleId
 * @param orgId
 * @returns string
 */

/**
 * Remove berth from realtime data when berth is deleted
 * @param berthId
 * @param orgId
 */
const removeBerthRealtime = (berthId: number, orgId: number) => {
  const key = generateKey(berthId, orgId);
  deviceRealtime.delete(key);
};
/**
 * Authorization socket with token
 * @param socket
 * @param next
 */
const authorizationSocket = (socket: AuthSocket, next: (err?: any) => void) => {
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
    next();
  } catch (error) {
    return next(new Error('Token is invalid'));
  }
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
        deviceRealtime.set(generateKey(berth.id, berth.orgId), {
          left_sensor: {
            id: berth.leftDevice?.id,
            value: berth.leftDevice?.realValue ?? null,
            oldVal: berth.leftDevice?.realValue ?? null,
            status: berth.leftDevice?.status ?? DeviceStatus.DISCONNECT,
            timestamp: new Date().getTime(),
          },
          right_sensor: {
            id: berth.rightDevice?.id,
            value: berth.rightDevice?.realValue ?? null,
            oldVal: berth.rightDevice?.realValue ?? null,
            status: berth.rightDevice?.status ?? DeviceStatus.DISCONNECT,
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
 * Get room key
 * @param berthId : string (berthId)
 * @param type : string (bas, config)
 */
const getRoomKey = (berthId: string, orgId: string, type: string) => {
  const key = `${type}_${berthId}_${orgId}`;
  // console.log(`[getRoomKey] Generated key: ${key}`);
  return key;
};

/**
 * Handle join socket. if socket is not auth, disconnect socket
 * @param socket
 */
const handleJoinSocket = async (socket: AuthSocket) => {
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
    try {
      const raw: RealtimeKafkaMessage = JSON.parse(message?.value?.toString() ?? '{}');
      const objectData: SocketRealtimeData = objectMapper.merge(
        raw,
        realtimeMapper
      ) as SocketRealtimeData;
      const key = generateKey(objectData.berthId, objectData.orgId);
      const room = getRoomKey(objectData.berthId.toString(), objectData.orgId.toString(), 'bas');

      const { data, record } = await processData(objectData);

      const isRunning = berthIsRunning.get(key) || null;
      if (isRunning) {
        const beginTs = isRunning.beginTs;
        const type = isRunning.type;
        berthIsRunning.set(key, {
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
        realtimeSocket.to(room.toString()).emit('data', JSON.stringify(data));

        if (data?.error_code) {
          await handleError(
            objectData.sessionId,
            objectData.berthId,
            objectData.orgId,
            data.error_code.toString(),
            record?.mooringStatus || 'DEPARTING'
          );
        } else {
          if (record?.mooringStatus !== 'DEPARTING' && record?.mooringStatus !== 'MOORING') {
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
              const berth = await berthDao.getBerthInfo(objectData.berthId, objectData.orgId);
              shouldEndRecording({
                berth: {
                  id: objectData.berthId,
                  name: berth?.name,
                  nameEn: berth?.nameEn,
                },
                orgId: objectData.orgId,
                sessionId: objectData.sessionId,
              });
            }
          }
        }
      }
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
      // Disconnect socket if not authorized within TIME_OUT
      setTimeout(() => {
        if (!socket.auth) {
          console.log(`Disconnecting unauthorized socket {id: ${socket?.id}}`);
          socket.disconnect(true);
        }
      }, TIME_OUT);

      socket.on('join', async (data: any) => {
        try {
          const { berthId } = JSON.parse(data);
          if (!berthId || !socket.auth?.orgId) {
            return;
          }

          const roomKey = getRoomKey(berthId, socket.auth.orgId.toString(), 'bas');
          socket.join(roomKey);
          rooms.add(roomKey);
          console.log(`Socket ${socket.id} joined room ${roomKey}`);
        } catch (error) {
          logError(error);
        }
      });

      socket.on('leave', async (data: any) => {
        try {
          const { berthId } = JSON.parse(data);
          if (!berthId || !socket.auth?.orgId) {
            return;
          }

          const roomKey = getRoomKey(berthId, socket.auth.orgId.toString(), 'bas');
          socket.leave(roomKey);

          const clients = await realtimeSocket.in(roomKey).fetchSockets();
          if (clients.length === 0) {
            rooms.delete(roomKey);
            console.log(`Room ${roomKey} deleted as it has no clients`);
          }
        } catch (error) {
          logError(error);
        }
      });

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
        socket.rooms?.forEach((room: any) => {
          socket.leave(room);
          console.log(`Socket ${socket.id} left room ${room}`);
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
  if (!objectData?.berthId || !objectData?.orgId || !objectData?.sessionId) {
    console.log('[processData] Missing required fields in objectData');
    return null;
  }

  console.log(
    `[processData] Processing data for berth ${objectData.berthId} and org ${objectData.orgId}`
  );
  console.log(`[processData] Data: ${JSON.stringify(objectData)}`);

  try {
    const record = await recordService.getRecordById(+objectData.sessionId, +objectData.orgId);
    // console.log('[processData] Record:', record?.toJSON ? record.toJSON() : record);
    const berth = await berthDao.getBerthInfo(+objectData.berthId, +objectData.orgId);
    // console.log('[processData] Berth:', berth?.toJSON ? berth.toJSON() : berth);
    if (!record || !berth?.leftDevice?.name || !berth?.rightDevice?.name) {
      return null;
    }

    const error_code = SENSOR_ERROR_CODE?.[objectData.error_code?.toString()] || '';
    const device = errorConverter(error_code);
    console.log('device', device);
    const left = ['both', 'left'].includes(device.side) ? device.status : DeviceStatus.CONNECT;
    const right = ['both', 'right'].includes(device.side) ? device.status : DeviceStatus.CONNECT;

    if (record.mooringStatus !== 'MOORING') {
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
        berthId: record.berthId,
        orgId: record.orgId,
      } as RecordHistoryInput,
      {
        left: berth.leftDevice?.id,
        right: berth.rightDevice?.id,
      },
      record?.mooringStatus ?? 'DEPARTING'
    );
    }


    return {
      data: cleanData(objectData, berth),
      record,
    };
  } catch (error) {
    logError(error);
    console.error('[processData] Error details:', error);
    throw error;
  }
};

/**
 * Convert error code to status and message
 * @param error : string
 *
 */
const errorConverter = (error: string) => {
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
        if (!socket.auth) {
          return;
        }
        const stringBerthId = getRoomKey(berthId, socket.auth.orgId.toString(), 'config');
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
        if (!socket.auth) {
          return;
        }
        const stringBerthId = getRoomKey(berthId, socket.auth.orgId.toString(), 'config');
        socket.leave(stringBerthId);
        const clients = await deviceSocket.in(stringBerthId).fetchSockets();
        if (clients.length === 0) {
          rooms.delete(stringBerthId);
          socket.disconnect(true);
          console.log(`Room ${stringBerthId} deleted and socket disconnected as it has no clients`);
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

  const consumer = createConsumer('device-data');

  await initKafkaData(
    async (message: KafkaMessage) => {
      const raw: RawRealtimeData = JSON.parse(message?.value?.toString() ?? '{}');
      const key = generateKey(raw.berthId, raw.orgId);
      const berthSensor = deviceRealtime.get(key);
      if (!berthSensor) {
        console.log(`[initRealtimeDevice] No berth sensor found for key: ${key}`);
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

      console.log('[initRealtimeDevice] Updating database with sensor data:', {
        left: {
          id: berthSensor.left_sensor.id,
          status: berthSensor.left_sensor.status,
          value: berthSensor.left_sensor.value,
          oldVal: berthSensor.left_sensor.oldVal,
          timeout: berthSensor.left_sensor.timestamp + TIMEOUT_DEVICE < new Date().getTime(),
        },
        right: {
          id: berthSensor.right_sensor.id,
          status: berthSensor.right_sensor.status,
          value: berthSensor.right_sensor.value,
          oldVal: berthSensor.right_sensor.oldVal,
          timeout: berthSensor.right_sensor.timestamp + TIMEOUT_DEVICE < new Date().getTime(),
        },
      });

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
        +raw.berthId,
        +raw.orgId
      );

      deviceSocket
        .to(getRoomKey(raw.berthId.toString(), raw.orgId.toString(), 'config'))
        .emit('device', JSON.stringify(deviceRealtime.get(key)));
    },
    consumer,
    BAS_DEVICE_REALTIME
  );

  const INTERVAL_TIME = 1000;
  const TIMEOUT_DEVICE = 1000 * 30;
  setInterval(async () => {
    // console.log('Device realtime: ', deviceRealtime);

    for (const berth of deviceRealtime.keys()) {
      const configData = deviceRealtime.get(berth);
      if (!configData) {
        continue;
      }
      const now = new Date().getTime();
      if (
        configData.left_sensor.timestamp + TIMEOUT_DEVICE < now &&
        configData.left_sensor.status !== DeviceStatus.DISCONNECT
        // && configData.left_sensor.oldVal !== configData.left_sensor.value
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
        // && configData.right_sensor.value !== configData.right_sensor.oldVal
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
        configData.berthId,
        configData.orgId
      );

      deviceRealtime.set(berth, configData);
      const orgId = configData.orgId.toString();
      deviceSocket
        .to(getRoomKey(berth.toString(), orgId, 'config'))
        .emit('device', JSON.stringify(deviceRealtime.get(berth)));
    }
  }, INTERVAL_TIME);
};

/**
 * emit end session to socket room
 * @param portEventSocketEndSession
 */
const shouldEndRecording = (portEventSocketEndSession: PortEventSocketEndSession) => {
  console.log(`[shouldEndRecording] Ending recording for berth ${portEventSocketEndSession.berth.id}`);
  generalSocket.emit('COMPLETED_SESSION', JSON.stringify(portEventSocketEndSession));
};


/**
 * Handle error from sensor
 * @param sessionId
 * @param berthId
 * @param orgId
 * @param code
 * @param mooringStatus [DEPARTING, BERTHING]
 */
const handleError = async (
  sessionId: string,
  berthId: number,
  orgId: number,
  code: string,
  mooringStatus: string
) => {
  console.log(`[handleError] Handling error for berth ${berthId}, code: ${code}`);
  try {
    const berth = await berthDao.getBerthInfo(berthId, orgId);
    if (!berth || !berth.leftDevice || !berth.rightDevice) {
      return;
    }
    const key = generateKey(berthId, orgId);
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
            orgId: orgId,
            errorCode: errorMessage.toUpperCase(),
          });
        }

        isRunning = berthIsRunning.get(key) || null;
        if (errorMessage === 'lost_target') {
          if (isRunning && !isRunning?.lostTargetAt) {
            berthIsRunning.set(key, {
              ...isRunning,
              lostTargetAt: new Date().getTime(),
              mooringStatus: mooringStatus,
            });
          }
        } else {
          if (isRunning && isRunning?.lostTargetAt) {
            berthIsRunning.set(key, {
              ...isRunning,
              lostTargetAt: undefined,
              mooringStatus: undefined,
            });
          }
        }
        break;
      default:
        isRunning = berthIsRunning.get(key) || null;
        if (isRunning && isRunning?.lostTargetAt) {
          berthIsRunning.set(key, {
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
  console.log(
    `[deviceIsError] Device error for berth ${portEventSocketDeviceError.berth.id}`
  );
  const eventName = `DEVICE_ERROR`;
  const eventData = JSON.stringify(portEventSocketDeviceError);

  // Emit to both general and berth-specific channels with consistent format
  generalSocket.emit(eventName, eventData);
  if (realtimeSocket) {
    const room = getRoomKey(
      portEventSocketDeviceError.berth.id.toString(),
      portEventSocketDeviceError.orgId.toString(),
      'bas'
    );
    realtimeSocket.to(room).emit(eventName, eventData);
  }
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
        console.log(`Disconnect socket {id: ${socket?.id} of port-events`);
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
  const INTERVAL_TIME = 1000;
  const TIMEOUT = 1000 * 30;
  const TIMEOUT_RECORD = 1000 * 60 * 60 * 6;
  const LOST_TARGET_THRESHOLD = 10000; // 10 seconds

  setIntervalAsync(async () => {
    for (const [key, value] of berthIsRunning) {
      if (typeof key !== 'string') {
        console.error(`[watchingBerth] Invalid key format: ${key}`);
        return;
      }

      const keyParts = key.split('-');
      if (keyParts.length !== 2) {
        console.error(`[watchingBerth] Invalid key format: ${key}`);
        return;
      }

      const berthId = parseInt(keyParts[0], 10);
      const orgId = parseInt(keyParts[1], 10);
      if (isNaN(berthId) || isNaN(orgId)) {
        console.error(`[watchingBerth] Invalid berthId or orgId in key: ${key}`);
        continue;
      }

      const now = new Date().getTime();

      // Lost target check (more than 10 seconds)
      if (value?.lostTargetAt && value?.lostTargetAt + LOST_TARGET_THRESHOLD < now) {
        const berth = await berthDao.getBerthInfo(berthId, orgId);
        const record = await recordService.getCurrentRecord(berthId, orgId);
        if (!berth || !berth.leftDevice || !berth.rightDevice || !record) {
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
            orgId: orgId,
          });
        } else {
          deviceIsError({
            sessionId: record?.sessionId,
            berth: {
              id: berthId,
              name: berth?.name,
              nameEn: berth?.nameEn,
            },
            orgId: orgId,
            errorCode: 'LOST_TARGET',
          });
        }
      }

      // Check if record duration exceeds 6 hours
      if (value.beginTs + TIMEOUT_RECORD < now) {
        const berth = await berthDao.getBerthInfo(berthId, orgId);
        console.log('Berth: ', berth);
        if (!berth || !berth.leftDevice || !berth.rightDevice) {
          continue;
        }
        // End record
        console.log('End record: ', berthId);
        const user = await userService.findUserByRole(SystemRole.ADMIN);
        if (!user) {
          continue;
        }
        const { isSync } = await berthService.resetBerth({
          berthId: berthId,
          orgId: orgId,
          status: BerthStatus.MOORING,
          modifier: user.id,
          isError: false,
          isFinish: true,
        });
        console.log('End record: ', isSync);
      }

      // Data check if no data received in 30 seconds
      if (value.timestamp + TIMEOUT < now && !value.isSent) {
        berthIsRunning.set(key, { ...value, isSent: true });
        const res = await recordService.getCurrentRecord(berthId, orgId);
        if (!res) {
          return;
        }
        const record = unflattenObject(res);
        const error = SENSOR_ERROR_CODE[1033];
        const errorMessage = error.split('@')[0];
        const room = getRoomKey(berthId.toString(), orgId.toString(), 'bas');
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
                  orgId: orgId,
                },
                record?.berth || null
              )
            )
          );
        }
        deviceIsError({
          sessionId: record.sessionId,
          berth: { id: berthId, name: record.berth?.name, nameEn: record.berth?.nameEn },
          orgId: orgId,
          errorCode: errorMessage.toUpperCase(),
        });
      }
    }
  }, INTERVAL_TIME);
};

const addBerthToWatch = (berthId: number, orgId: number, beginTs: number, type: string) => {
  const key = generateKey(berthId, orgId);
  berthIsRunning.set(key, {
    timestamp: new Date().getTime(),
    beginTs,
    type,
    isSent: false,
  });
};

const removeBerthFromWatch = (key: string) => {
  berthIsRunning.delete(key);
};

const initWatchBerth = async () => {
  const records = await berthDao.getBerthsWithHaveRecording();
  console.log('Init watch berth: ', records.length);
  records.forEach((frame: any) => {
    if (!frame.berth || !frame.orgId) {
      console.log(`Skipping record because no berth found or missing orgId for record: ${frame?.id}`);
      return;
    }
    const beginTs = new Date(frame?.startTime).getTime();
    console.log('Add berth to watch: ', `${frame.berth.id}-${frame.orgId}`, beginTs);
    addBerthToWatch(frame.berth.id, frame.orgId, beginTs, frame.mooringStatus);
  });
};

/**
 * Init realtime service
 * @param io
 */
const init = (io: Server) => {
  try {
    revokeTokenService.init();
    initQueue()
      .then(() => logSuccess('Init queue successfully'))
      .catch((error) => logError(`Failed to initialize queue: ${error}`));
    initRealtimeData(io).then(() => logSuccess('Init realtime data successfully'));
    initDeviceData().then(() =>
      initRealtimeDevice(io).then(() => logSuccess('Init realtime device successfully'))
    );
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
