export const AlarmStatus = {
  OPERATOR: 1,
  WARNING: 2,
  EMERGENCY: 3,
};

export const AlarmStatusColor = {
  [AlarmStatus.WARNING]: "#FFE146",
  [AlarmStatus.EMERGENCY]: "#EA3636",
};

export const NORMAL_STATUS_ID = AlarmStatus.OPERATOR;

export const DeviceStatusCode = {
  CONNECTED: 1,
  DISCONNECTED: 2,
  ERROR: 3,
};

export const DeviceStatusColor = {
  [DeviceStatusCode.CONNECTED]: "green",
  [DeviceStatusCode.DISCONNECTED]: "#b0bec5",
  [DeviceStatusCode.ERROR]: "red",
};
