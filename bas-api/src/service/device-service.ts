import { sensorDao } from "@bas/database/dao";

export const getDevice = async (id: number) => {
  const devices = await sensorDao.getSensorByBerthId(id);
  if (!devices || devices.length === 0) {
    throw new Error("Device not found");
  }
  return devices;
}