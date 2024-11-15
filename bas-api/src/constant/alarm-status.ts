export const alarmStatus : any = {
  OPERATOR: 1,
  WARNING: 2,
  EMERGENCY: 3,
};

export const alarmType = {
  DISTANCE: 'distance',
  SPEED: 'speed',
  ANGLE: 'angle',
};

export const getAlarmStatusMessages = (status: number) => {
  switch (status) {
    case alarmStatus.OPERATOR:
      return {
        nameEn: 'Operator',
        name: 'Bình thường',
      };
    case alarmStatus.WARNING:
      return {
        nameEn: 'Warning',
        name: 'Cảnh báo',
      };
    case alarmStatus.EMERGENCY:
      return {
        nameEn: 'Emergency',
        name: 'Khẩn cấp',
      };
    default:
      return null;
  }
};
