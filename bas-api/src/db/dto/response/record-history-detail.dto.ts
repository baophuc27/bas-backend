export interface RecordHistoryDetailDto {
  id: number;
  recordId: number;
  time: Date;
  zone: number;
  leftSensorDistance: number;
  leftSensorSpeed: number;
  rightSensorDistance: number;
  rightSensorSpeed: number;
  angle: number;
}
