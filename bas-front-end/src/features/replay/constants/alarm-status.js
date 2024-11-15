const AlarmStatus = {
  OPERATOR: 1,
  WARNING: 2,
  EMERGENCY: 3,
};

export const AlarmStatusColor = {
  [AlarmStatus.WARNING]: "#FFE146",
  [AlarmStatus.EMERGENCY]: "#EA3636",
};

export const NORMAL_STATUS_ID = AlarmStatus.OPERATOR;
