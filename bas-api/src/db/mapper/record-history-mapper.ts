export const recordHistoryMapper = {
  id: 'id',
  time: 'time',
  leftSpeed: 'leftSpeed',
  leftDistance: 'leftDistance',
  rightSpeed: 'rightSpeed',
  rightDistance: 'rightDistance',
  angle: 'angle',
  angleZone: 'angleZone',
  LSpeedZone: 'LSpeedZone',
  RSpeedZone: 'RSpeedZone',
  LDistanceZone: 'LDistanceZone',
  RDistanceZone: 'RDistanceZone',
  RDistanceAlarm: 'RDistanceAlarm',
  LDistanceAlarm: 'LDistanceAlarm',
  RSpeedAlarm: 'RSpeedAlarm',
  LSpeedAlarm: 'LSpeedAlarm',
  angleAlarm: 'angleAlarm',
  leftStatus: 'leftStatus',
  rightStatus: 'rightStatus',
};

export const recordHistoryChartMapper = {
  time: 'time',
  leftSpeed: 'leftSpeed',
  leftDistance: 'leftDistance',
  rightSpeed: 'rightSpeed',
  rightDistance: 'rightDistance',
};

export const recordHistoryMapperReverse = (leftCode : number  , rightCode : number) => {
  return {
    id: 'id',
    time: 'event_time',
    leftSpeed: `speed.${leftCode}.value`,
    leftDistance: `distance.${leftCode}.value`,
    rightSpeed: `speed.${rightCode}.value`,
    rightDistance: `distance.${rightCode}.value`,
    angle: 'angle.value',
    angleZone: 'angle.zone',
    LSpeedZone: `speed.${leftCode}.zone`,
    RSpeedZone: `speed.${rightCode}.zone`,
    LDistanceZone: `distance.${leftCode}.zone`,
    RDistanceZone: `distance.${rightCode}.zone`,
    RDistanceAlarm: `distance.${rightCode}.alarm`,
    LDistanceAlarm: `distance.${leftCode}.alarm`,
    RSpeedAlarm: `speed.${rightCode}.alarm`,
    LSpeedAlarm: `speed.${leftCode}.alarm`,
    angleAlarm: 'angle.alarm',
    'record.berthId': 'berth_id',
  }
}