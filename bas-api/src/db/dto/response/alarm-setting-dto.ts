export interface AlarmSettingDto {
  id: number;
  alarmSensor: string;
  alarmType: string;
  alarmZone: string;
  operator: string;
  value: number;
  statusId: number;
  defaultValue: number;
  message: string;
  berth: {
    id: number;
    name: string;
  };
  orgId: number;
}

export interface AlarmCondition {
  alarmSettingId?: number;
  status_id: number;
  operator: string;
  value: number;
  message?: string;
  defaultValue?: number;
}

export interface AlarmSensor {
  [AlarmSensorName: string]: AlarmCondition[];
}

export interface AlarmZone {
  [AlarmTypeName: string]: AlarmSensor | AlarmCondition[];
}

export interface AlarmSettingData {
  [AlarmZoneName: string]: AlarmZone;
}
