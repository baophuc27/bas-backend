import axios from 'axios';
import { CLOUD_HOST } from '@bas/config';
import { VNEMISOFT_API, VNEMISOFT_API_KEY } from '@bas/config';

const axiosCloud = axios.create({
  baseURL: CLOUD_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

const instance = axios.create({
  baseURL: VNEMISOFT_API,
  headers: {
    'Content-Type': 'application/json',
    bastoken: VNEMISOFT_API_KEY,
  },
});
export { axiosCloud, instance };
