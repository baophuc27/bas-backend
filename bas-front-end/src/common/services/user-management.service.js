import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/users";

export const UserManagementService = {
  getAll(params) {
    const url = ROOT_PATH;

    return authAxiosClient.get(url, {
      params,
    });
  },
  getAllRoles(params) {
    const url = `${ROOT_PATH}/roles`;

    return authAxiosClient.get(url, {
      params,
    });
  },
  getAllAvailableAccounts() {
    const url = `${ROOT_PATH}/azure/available-accounts`;

    return authAxiosClient.get(url);
  },
  getById(id) {
    const url = `${ROOT_PATH}/${id}`;

    return authAxiosClient.get(url);
  },
  create(data) {
    const url = ROOT_PATH;

    return authAxiosClient.post(url, data);
  },
  updateById(id, data) {
    const url = `${ROOT_PATH}/${id}`;

    return authAxiosClient.put(url, data);
  },
  deleteById(id) {
    const url = `${ROOT_PATH}/${id}`;

    return authAxiosClient.delete(url);
  },
  updatePasswordById(id, password) {
    const url = `${ROOT_PATH}/${id}/password`;
    return authAxiosClient.put(url, { password });
  },
  getSocketAccessToken() {
    const url = `${ROOT_PATH}/data-token`;

    return authAxiosClient.get(url);
  },
};
