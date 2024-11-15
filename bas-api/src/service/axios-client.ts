import axios from 'axios';
import { stringify } from 'querystring';
const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  paramsSerializer: (params) => stringify(params),
});

// axiosClient.interceptors.request.use(async (config) => {});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

const axiosAri = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosAri.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export { axiosClient, axiosAri };
