import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/users/me";

export const AccountInfoService = {
  getById() {
    const url = ROOT_PATH;

    return authAxiosClient.get(url);
  },
  update(data) {
    const url = ROOT_PATH;
    return authAxiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
