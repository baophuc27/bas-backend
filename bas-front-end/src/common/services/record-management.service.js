import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/records";

export const RecordManagementService = {
  getAll(params) {
    const url = ROOT_PATH;
    return authAxiosClient.get(url, {
      params,
    });
  },
  getDetail(id, params) {
    const url = `${ROOT_PATH}/${id}`;
    return authAxiosClient.get(url, {
      params,
    });
  },
  deleteById(id) {
    const url = `${ROOT_PATH}/${id}`;
    return authAxiosClient.delete(url);
  },
  getAggregatedData(id) {
    const url = `${ROOT_PATH}/aggregates/${id}`;
    return authAxiosClient.get(url);
  },
  getChartsData(id) {
    const url = `${ROOT_PATH}/chart/${id}`;
    return authAxiosClient.get(url);
  },
  // resyncData(id) {
  //   const url = `${ROOT_PATH}/${id}/sync`;
  //   return authAxiosClient.post(url);
  // },
  exportData(id, language = "en") {
    const url = `${ROOT_PATH}/export-data/${id}?language=${language}`;

    return authAxiosClient.get(url, {
      responseType: "arraybuffer",
    });
  },
};
