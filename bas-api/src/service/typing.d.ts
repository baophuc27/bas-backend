import { Socket } from 'socket.io';
import { BerthStatus } from '@bas/constant/berth-status';

export interface BaseQueryParams {
  search?: string;
  order?: string;
  mode?: 'ASC' | 'DESC';
  amount?: number;
  page?: number;
  orgId?: number;
}

export interface UserUpdatePayload {
  fullName?: string;
  roleId?: number;
  phone?: string;
  avatar?: string | null;
  email?: string;
  userPrincipalName?: string;
  orgId?: number;
}

export interface OrgPayload {
  orgName: string;
  orgLogo: string;
}

export interface UserQueryParams extends BaseQueryParams {
  roleId?: number;
}

type userDataPayload = {
  userId: string;
  roleId: number;
  orgId: number;
};

export interface AuthSocket extends Socket {
  auth?: userDataPayload | TokenData;
  context?: RequestContext;
}

export interface PortEventSocketEndSession {
  sessionId: string;
  berth: {
    id: number;
    name?: string;
    nameEn?: string;
  };
  orgId?: number;
}

export interface PortEventSocketDeviceError {
  sessionId: string;
  berth: {
    id: number;
    name?: string;
    nameEn?: string;
  };
  errorCode: string;
  orgId?: number;
}

type TokenData = {
  userId: string;
  roleId: number;
  orgId: number;
};

export interface BerthFilter extends BaseQueryParams {
  berthId?: number;
  status?: number;
  vesselId?: number;
  page?: number | null | undefined;
  amount?: number | null | undefined;
  orgId?: number;
}

export interface RecordFilter extends BaseQueryParams {
  berthId?: number;
  vesselId?: number;
  orgId?: number;
}

export interface RecordHistoryQueryParams extends BaseQueryParams {}

export interface AlarmQueryParams extends BaseQueryParams {
  type?: string;
  alarm?: string;
  berth?: string;
  withoutPagination?: boolean;
}

type SensorData = {
  [key: string]: {
    value: number;
    alarm: number;
    zone: number;
  };
};

type SocketRealtimeData = {
  speed: SensorData;
  distance: SensorData;
  angle?: {
    value: number;
    alarm: number;
    zone: number;
  };
  timestamp: number;
  berthId: number;
  eventTime: string;
  sessionId: string;
  error_code?: any;
  orgId: number;
};

type SensorPayload = {
  value: number;
  status_id: number;
  zone: number;
  orgId?: number;
};

type SensorPairPayload = {
  [key: number]: SensorPayload;
};

type RealtimeKafkaMessage = {
  speed: SensorPairPayload;
  distance: SensorPairPayload;
  angle: SensorPayload;
  event_time: string;
  berth_id: number;
  session_id: string;
  error_code?: number;
  orgId?: number;
};

export interface NamespaceRealtimeSocket {
  join: (data: any) => void;
  leave: (data: any) => void;
  data: (data: string) => void;
}

type AlarmDataUnit = {
  value?: number | null;
  alarm?: number | null;
  zone?: number | null;
  startTime: Date;
  endTime?: Date | null;
  recordId: number;
  side?: number;
  type?: string;
  orgId?: number;
};

type AlarmUnit = {
  status_id: number;
  value: number;
  operator: string;
  orgId?: number;
};

type StartRecordAlarmPayload = {
  distance?: {
    left_sensor: AlarmUnit;
    right_sensor: AlarmUnit;
  };
  speed?: {
    left_sensor: AlarmUnit;
    right_sensor: AlarmUnit;
  };
  angle?: AlarmUnit;
};

type StartRecordPayload = {
  berth_id: number;
  session_id: number;
  mode: 'start' | 'stop';
  distance_left_sensor_to_fender?: number;
  distance_right_sensor_to_fender?: number;
  distance_between_sensors?: number;
  limit_zone_1?: number;
  limit_zone_2?: number;
  limit_zone_3?: number;
  alarm?: StartRecordAlarmPayload;
  orgId?: number;
};

type DeviceUnit = {
  id: number;
  value: number | null;
  oldVal?: number | null;
  status: number;
  error?: string | null;
  timestamp: number;
  orgId?: number;
};

type DeviceRealValue = {
  left_sensor: DeviceUnit;
  right_sensor: DeviceUnit;
  berthId: number;
  orgId?: number;
};

type resetBerthParam = {
  berthId: number;
  status: BerthStatus;
  modifier: string;
  isFinish?: boolean;
  isError?: boolean;
  orgId?: number;
};

type AlarmData = {
  value: number;
  alarm: number;
  zone: number;
  startTime: Date;
  endTime?: Date | null;
  type: string;
  message?: string | null;
  side: number;
  record: {
    id: number;
    sessionId: string;
    berth: {
      name: string;
      nameEn: string;
    };
  };
  sensor: {
    id: number;
    name: string;
  };
  orgId?: number;
};

type RawRealtimeData = {
  berthId: number;
  sensorsType: 'RIGHT' | 'LEFT';
  speed: number;
  distance: number;
  error_code: number;
  orgId?: number;
};

type createAlarmPayload = {
  orgId: number;
  recordId: number;
  type: string;
  value?: number | null;
  zone?: number | null;
  alarm: number;
  startTime: Date;
  message?: string | null;
  side: number | null;
  sensorId: number | null;
};
