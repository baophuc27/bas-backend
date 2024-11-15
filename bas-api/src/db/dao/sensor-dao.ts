import { Sensor } from '../models';
import { DeviceStatus } from '@bas/constant/device-status';

type sensorUpdatePayload = {
  id: number;
  status: number;
  value?: number | null;
  oldVal?: number | null;
  timeout?: boolean;
};

export const updatePairDevice = async (
  leftSensor: sensorUpdatePayload,
  rightSensor: sensorUpdatePayload
) => {
  if (leftSensor.value != leftSensor.oldVal) {
    await Sensor.update(
      {
        realValue: leftSensor.value,
        status: leftSensor.status,
      },
      {
        where: {
          id: leftSensor.id,
        },
      }
    );
  }

  if (rightSensor.value != rightSensor.oldVal) {
    await Sensor.update(
      {
        realValue: rightSensor.value,
        status: rightSensor.status,
      },
      {
        where: {
          id: rightSensor.id,
        },
      }
    );
  }
};

export const updateDevice = async (id: number, status: number, value?: number) => {
  const val = value
    ? {
        realValue: value,
      }
    : {
        ...(status == DeviceStatus.DISCONNECT
          ? {
              realValue: null,
            }
          : {}),
      };

  await Sensor.update(
    {
      ...val,
      status: status,
    },
    {
      where: {
        id,
      },
    }
  );
};
