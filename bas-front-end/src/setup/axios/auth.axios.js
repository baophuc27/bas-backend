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
       }
     );

     if (refreshLoginResp?.data?.success) {
       const { data, refreshToken, token } = refreshLoginResp?.data;

       // Cập nhật Redux store
       store.dispatch(
         logIn({
           auth: data,
           isLoggedIn: true,
           token: token,
           refreshToken: refreshToken,
           roleId: data?.roleId,
         })
       );

       processFailedQueue(token);
       return token;
     }

     return "";
   } catch (error) {
     console.error("Error during token refresh:", error);
     failedQueue = [];
     store.dispatch(logOut()); // Xử lý logout nếu refresh thất bại
   } finally {
     isRefreshing = false;
   }
   return "";
 };
  authAxiosClient.interceptors.request.use(
    (config) => {
      const accessToken = store?.getState()?.user?.auth?.token;
      const orgId = store?.getState()?.organization?.id;

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (orgId) {
        config.headers["orgId"] = orgId; // Thêm orgId vào headers
      } else {
        console.warn("orgId is missing in request");
      }

      return config;
    },
    (error) => Promise.reject(error)
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
    }
  );
};
