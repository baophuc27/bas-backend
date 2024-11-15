import { authAxiosClient } from "setup/axios/auth.axios";
import publicAxiosClient from "setup/axios/public.axios";

const ROOT_PATH = "/auth";

export const AuthService = {
  logIn(data) {
    const url = `${ROOT_PATH}/identify`;
    return publicAxiosClient.post(url, data, {
      withCredentials: true,
    });
  },
  logOut(refreshToken) {
    const url = `${ROOT_PATH}/logout`;
    return authAxiosClient.post(
      url,
      { refreshToken },
      {
        withCredentials: true,
      }
    );
  },
  authenticate(token) {
    const url = `${ROOT_PATH}/authenticate`;
    return publicAxiosClient.post(
      url,
      { token },
      {
        withCredentials: true,
      }
    );
  },
  updateMyPassword(newPassword) {
    const url = `${ROOT_PATH}/password`;
    return authAxiosClient.put(url, {
      newPassword,
    });
  },
};
