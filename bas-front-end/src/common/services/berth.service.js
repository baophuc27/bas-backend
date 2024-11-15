import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/berth";

export const BerthService = {
  getAll(params) {
    return authAxiosClient.get(ROOT_PATH, {
      params,
    });
  },
  getDetail(berthId) {
    return authAxiosClient.get(`${ROOT_PATH}/${berthId}`);
  },
  getStatuses() {
    return authAxiosClient.get(`${ROOT_PATH}/status`);
  },
  create(body) {
    return authAxiosClient.post(ROOT_PATH, {
      // name, nameEn, directionCompass, limitZone1, limitZone2, limitZone3, distanceToLeft, distanceToRight, distanceFender, distanceDevice
      ...body,
    });
  },
  update(id, body) {
    // name, directionCompass, limitZone1, limitZone2, limitZone3, distanceFender, distanceDevice

    const url = `${ROOT_PATH}/${id}`;
    return authAxiosClient.put(url, {
      ...body,
    });
  },
  updateConfig(id, body) {
    return authAxiosClient.put(`${ROOT_PATH}/${id}/config`, {
      // distanceToLeft, distanceToRight, vessel {id, name, width, length, ballastWater, deadWeight}, vesselDirection
      ...body,
    });
  },
  reset(id, isError) {
    return authAxiosClient.post(`${ROOT_PATH}/${id}/reset`, {
      isError,
    });
  },
  finishSession(id) {
    return authAxiosClient.post(`${ROOT_PATH}/${id}/finish-session`);
  },
  getLatestRecords(id, startTime, endTime) {
    return authAxiosClient.get(
      `/records/latest?berthId=${id}&startTime=${startTime}&endTime=${endTime}`
    );
  },
  deleteById(id) {
    return authAxiosClient.delete(`${ROOT_PATH}/${id}`);
  },
};
