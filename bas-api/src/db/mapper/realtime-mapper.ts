const valueMapper = (value: any) => {
  const result: any = {};
  Object.keys(value).forEach((key) => {
    result[key] = {
      value: value[key]?.value,
      alarm: value[key]?.status_id,
      zone: value[key]?.zone,
      is_connected: true,
    };
  });
  return result;
};

const realtimeMapper = {
  berth_id: 'berthId',
  event_time: 'eventTime',
  speed: {
    key: 'speed',
    transform: valueMapper,
  },
  distance: {
    key: 'distance',
    transform: valueMapper,
  },
  angle: {
    key: 'angle',
    transform: (value: any) => {
      return {
        value: value?.value,
        alarm: value?.status_id,
        zone: value?.zone,
      };
    },
  },
  timestamp: 'timestamp',
  session_id: 'sessionId',
  error_code: 'error_code',
  orgid: 'orgId',
};

export { realtimeMapper };
