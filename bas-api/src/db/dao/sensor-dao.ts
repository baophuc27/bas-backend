import { Sensor } from '../models';
import { DeviceStatus } from '@bas/constant/device-status';
import { AsyncContext } from '@bas/utils/AsyncContext';

type sensorUpdatePayload = {
  id: number;
  status: number;
  value?: number | null;
  oldVal?: number | null;
  timeout?: boolean;
};

const addOrgIdToConditions = () => {
  const context = AsyncContext.getContext();
  if (!context?.orgId) {
    console.warn('[Sensor-DAO] orgId is missing in AsyncContext, using default orgId.');
    // throw new Error('orgId is required but not found in context');
    return { orgId: 0 };
  }
  return { orgId: context.orgId };
};

const orgCondition = addOrgIdToConditions();

export const updatePairDevice = async (
  leftSensor: sensorUpdatePayload,
  rightSensor: sensorUpdatePayload,
  berthId: number
) => {
  const orgCondition = addOrgIdToConditions();

  if (leftSensor.value !== leftSensor.oldVal) {
    await Sensor.update(
      {
        realValue: leftSensor.value,
        status: leftSensor.status,
      },
      {
        where: {
          id: leftSensor.id,
          berthId,
          ...orgCondition,
        },
      }
    );
  }

  if (rightSensor.value !== rightSensor.oldVal) {
    await Sensor.update(
      {
        realValue: rightSensor.value,
        status: rightSensor.status,
      },
      {
        where: {
          id: rightSensor.id,
          berthId, // Áp dụng bến
          ...orgCondition, // Áp dụng orgId
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
