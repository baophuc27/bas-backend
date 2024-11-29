import axios from "axios";
import { logIn, logOut } from "redux/slices/user.slice";

export let authAxiosClient = null;

let isRefreshing = false;

export const setupAuthAxiosClient = (store) => {
  authAxiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "application/json",
    },
  });

  let failedQueue = [];

  const processFailedQueue = (access_token) => {
    failedQueue.forEach((prom) => {
      prom.resolve(access_token);
    });
    failedQueue = [];
  };

  const refresh = async () => {
    isRefreshing = true;

    try {
      const refreshLoginResp = await authAxiosClient.post(
        `${process.env.REACT_APP_API_URL}/auth/refresh-login`,
        {
          refreshToken: store?.getState()?.user?.auth?.refreshToken,
        },
        {
          withCredentials: true,
        },
      );

      if (refreshLoginResp?.data?.success) {
        const { data, refreshToken, token } = refreshLoginResp?.data;

        store.dispatch(
          logIn({
            auth: data,
            isLoggedIn: true,
            token: token,
            refreshToken: refreshToken,
            roleId: data?.roleId,
          }),
        );

        processFailedQueue(token);
        return token;
      }

      return "";
    } catch (error) {
    } finally {
      isRefreshing = false;
    }
    return "";
  };

  authAxiosClient.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"]) {
        const accessToken = store?.getState()?.user?.auth?.token;

        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  authAxiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const prevRequest = error?.config;
      if (error.response.status === 401) {
        if (!isRefreshing) {
          const newAccessToken = await refresh();
          if (newAccessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return await authAxiosClient(prevRequest);
          } else {
            failedQueue = [];
            store.dispatch(logOut());
          }
        } else {
          return new Promise((resolve) => {
            failedQueue.push({ resolve });
          }).then((access_token) => {
            prevRequest.headers.Authorization = `Bearer ${access_token}`;
            return authAxiosClient(prevRequest);
          });
        }
      }
      return Promise.reject(error);
    },
  );
};
