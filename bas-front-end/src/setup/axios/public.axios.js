import axios from "axios";

const publicAxiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
});

export default publicAxiosClient;
