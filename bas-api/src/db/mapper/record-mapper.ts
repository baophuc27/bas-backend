export const recordDetailMapper = {
  id: 'id',
  sessionId: 'sessionId',
  startTime: 'startTime',
  endTime: 'endTime',
  mooringStatus: 'mooringStatus',
  syncStatus: 'syncStatus',
  vesselDirection: 'vesselDirection',
  distanceFender: 'distanceFender',
  distanceDevice: 'distanceDevice',
  distanceToLeft: 'distanceToLeft',
  distanceToRight: 'distanceToRight',
  directionCompass: 'directionCompass',
  'vessel.id': 'vessel.id',
  'vessel.name': 'vessel.name',
  'vessel.nameEn': 'vessel.nameEn',
  'berth.id': 'berth.id',
  'berth.name': 'berth.name',
  'berth.nameEn': 'berth.nameEn',
};

export const recordAggregateMapper = {
  maxAngle: 'maxAngle',
  minAngle: 'minAngle',
  avgAngle: 'avgAngle',
  maxLeftDistance: 'maxLeftDistance',
  minLeftDistance: "minLeftDistance",
  avgLeftDistance: 'avgLeftDistance',
  maxRightDistance: 'maxRightDistance',
  minRightDistance: "minRightDistance",
  avgRightDistance: 'avgRightDistance',
  maxLeftSpeed: 'maxLeftSpeed',
  minLeftSpeed: "minLeftSpeed",
  avgLeftSpeed: 'avgLeftSpeed',
  maxRightSpeed: 'maxRightSpeed',
  minRightSpeed: "minRightSpeed",
  avgRightSpeed: 'avgRightSpeed'
}

export const recordCreateMapper = {
  ...recordDetailMapper,
  berthId: 'berthId',
  vesselId: 'vesselId',
  createdBy: 'createdBy',
};
