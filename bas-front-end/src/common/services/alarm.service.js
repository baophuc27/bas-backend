import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/alarm";
const SETTING_ROOT_PATH = "/alarm-setting";

export const AlarmService = {
  getAll(params) {
    return authAxiosClient.get(ROOT_PATH, {
      params,
    });
  },
  deleteById(id) {
    return authAxiosClient.delete(`${ROOT_PATH}/${id}`);
  },
  deleteAll() {
    return authAxiosClient.delete(`${ROOT_PATH}/all`);
  },
  exportData(params, language = "en") {
    return authAxiosClient.get(
      `${ROOT_PATH}/export-data?language=${language}`,
      {
        responseType: "arraybuffer",
        params,
      },
    );
  },

  getSettingDetail(berthId) {
    return authAxiosClient.get(`${SETTING_ROOT_PATH}/${berthId}`);
  },
  updateSetting(body) {
    // body is array of objects
    // id, alarmType, alarmZone, alarmSensor, value, message
    const url = `${SETTING_ROOT_PATH}`;
    return authAxiosClient.put(url, {
      alarmSettings: body,
    });
  },
};
