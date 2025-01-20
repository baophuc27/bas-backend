import axios from 'axios';
import { API_URL } from '../config';

export const deviceService = {
  async getDevicesByBerthId(berthId) {
    try {
      const response = await axios.get(`${API_URL}/device/${berthId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
