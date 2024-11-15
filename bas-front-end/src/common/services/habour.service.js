import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/harbor";

export const HabourService = {
  getData() {
    return authAxiosClient.get(`${ROOT_PATH}/information`);
  },
  update(data) {
    const url = `${ROOT_PATH}/configuration`;

    return authAxiosClient.put(url, data);
  },
};
