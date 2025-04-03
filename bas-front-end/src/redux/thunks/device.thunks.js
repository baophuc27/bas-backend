import { deviceService } from '../../services/device.service';
import { 
  getDevicesStart, 
  getDevicesSuccess, 
  getDevicesFailure 
} from '../slices/device.slice';

export const fetchDevices = (berthId) => async (dispatch) => {
  try {
    dispatch(getDevicesStart());
    const data = await deviceService.getDevicesByBerthId(berthId);
    dispatch(getDevicesSuccess(data));
  } catch (error) {
    dispatch(getDevicesFailure(error.toString()));
  }
};
