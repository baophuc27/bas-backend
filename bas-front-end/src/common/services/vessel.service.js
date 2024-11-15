import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/vessels";

export const VesselService = {
  getAll() {
    return authAxiosClient.get(`${ROOT_PATH}`);
  },
};
