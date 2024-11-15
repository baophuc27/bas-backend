import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/common";

export const CommonService = {
  getOrganizationData() {
    return authAxiosClient.get(`${ROOT_PATH}/org-information`);
  },
};
