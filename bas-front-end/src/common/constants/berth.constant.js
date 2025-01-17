export const BERTH_STATUS = {
  AVAILABLE: 0,
  MOORING: 1,
  BERTHING: 2,
  DEPARTING: 3,
};

export const BERTH_STATUS_CODE = {
  0: "AVAILABLE",
  1: "MOORING",
  2: "BERTHING",
  3: "DEPARTING",
};

export const getMooringStatus = (t, status) => {
  switch (status) {
    case "AVAILABLE":
      return t("berthing:status.available");
    case "MOORING":
      return t("berthing:status.mooring");
    case "BERTHING":
      return t("berthing:status.berthing");
    case "DEPARTING":
      return t("berthing:status.departing");
    default:
      return "";
  }
};

export const mapSensorStatusText = (key) => {
  switch (key) {
    case "lost_target":
      return "berthing:sensor_status.lost_target";
    case "weak_signal":
      return "berthing:sensor_status.weak_signal";
    case "data_noise":
      return "berthing:sensor_status.data_noise";
    case "lost_connect":
      return "berthing:sensor_status.lost_connect";
    case "disconnected":
      return "berthing:sensor_status.disconnected";
    default:
      return "berthing:sensor_status.normal";
  }
};

export const sensorStatusColor = (errorCode) => {
  switch (errorCode) {
    case "lost_target":
    case "disconnected":
    case "lost_connect":
      return "#B0BEC5";
    case "weak_signal":
    case "data_noise":
      return "#FBC02D";
    case "normal":
      return "#00FF00";
    default: // no connection
      return "#B0BEC5";
  }
};

export const sensorStatusColorDock = (errorCode) => {
  switch (errorCode) {
    case "lost_target":
    case "disconnected":
    case "lost_connect":
      return "#B0BEC5";
    case "weak_signal":
    case "data_noise":
      return "#FBC02D";
    default:
      return "#00FF00";
  }
};
export const getSyncStatus = (t, status) => {
  switch (status) {
    case "SUCCESS":
      return t("berthing:sync_status.success");
    case "FAILED":
      return t("berthing:sync_status.failed");
    case "PENDING":
      return t("berthing:sync_status.pending");
    default:
      return "";
  }
};

/*
1011: "lost_target@left",
1012: "lost_target@right",
1013: "lost_target@both",
1021: "weak_signal@left",
1022: "weak_signal@right",
1023: "weak_signal@both",
1031: "disconnected@left",
1032: "disconnected@right",
1033: "disconnected@both",
*/
export const mapSensorVisualization = (code) => {
  switch (code) {
    case 1011:
      return {
        left_sensor: "lost_target",
      };
    case 1012:
      return {
        right_sensor: "lost_target",
      };
    case 1013:
      return {
        left_sensor: "lost_target",
        right_sensor: "lost_target",
      };
    case 1021:
      return {
        left_sensor: "weak_signal",
      };
    case 1022:
      return {
        right_sensor: "weak_signal",
      };
    case 1023:
      return {
        left_sensor: "weak_signal",
        right_sensor: "weak_signal",
      };
    case 1031:
      return {
        left_sensor: "disconnected",
      };
    case 1032:
      return {
        right_sensor: "disconnected",
      };
    case 1033:
      return {
        left_sensor: "disconnected",
        right_sensor: "disconnected",
      };
    default:
      return {};
  }
};

export const BERTH_STATUS_COLOR = {
  [BERTH_STATUS.AVAILABLE]: "#ACACAC",
  [BERTH_STATUS.MOORING]: "#3699FF",
  [BERTH_STATUS.DEPARTING]: "#EA3636",
  [BERTH_STATUS.BERTHING]: "#69AE3A",
};

export const BERTH_STATUS_BORDER_COLOR = {
  [BERTH_STATUS.AVAILABLE]: "#6D6C6C",
  [BERTH_STATUS.MOORING]: "#081D64",
  [BERTH_STATUS.DEPARTING]: "#EA3636",
  [BERTH_STATUS.BERTHING]: "#26631C",
};
