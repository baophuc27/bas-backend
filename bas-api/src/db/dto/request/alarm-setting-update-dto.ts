export interface AlarmSettingUpdateDto {
  id: number;
  message?: string | null;
  value: number;
  alarmType?: string;
  alarmZone?: string;
  alarmSensor?: string;
  statusId?: number;
  operator?: string;
  defaultValue?: number;
  orgId: number;
}
