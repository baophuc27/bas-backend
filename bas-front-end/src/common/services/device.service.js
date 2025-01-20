import { authAxiosClient } from "setup/axios/auth.axios";

const ROOT_PATH = "/device";

export const DeviceService = {
    getDeviceData() {
        return authAxiosClient.get(`${ROOT_PATH}/device-information`);
    }
}