import activeBouyFlicker from "assets/images/active-buoy-flicker.svg";
import activeBuoy from "assets/images/active-buoy.svg";
import alarmedBuoyFlicker from "assets/images/alarmed-buoy-flicker.svg";
import alarmedBuoy from "assets/images/alarmed-buoy.svg";
import normalBuoy from "assets/images/normal-buoy.svg";
import offlineBuoy from "assets/images/offline-buoy.svg";
import warningBuoyFlicker from "assets/images/warning-buoy-flicker.svg";
import warningBuoy from "assets/images/warning-buoy.svg";
import { DEVICE_STATUS } from "./device-node.constant";
import classes from "./device-node.style.module.css";

export const DeviceNode = ({
  status,
  isActive = false,
  selectedDevice = null,
}) => {
  const getIconByStatus = (deviceStatus) => {
    switch (deviceStatus) {
      case DEVICE_STATUS.OFFLINE:
        return [offlineBuoy, offlineBuoy];

      case DEVICE_STATUS.EMERGENCY:
        return [alarmedBuoy, alarmedBuoyFlicker];

      case DEVICE_STATUS.WARNING:
        return [warningBuoy, warningBuoyFlicker];

      case DEVICE_STATUS.NORMAL:
        return [activeBuoy, activeBouyFlicker];

      default:
        return [normalBuoy, normalBuoy];
    }
  };

  const getClassNames = (activeClassName, inactiveClassName) => {
    // if (selectedDevice === null) {
    //   return activeClassName;
    // } else {
    //   if (isActive) {
    //     return activeClassName;
    //   } else {
    //     return inactiveClassName;
    //   }
    // }

    if (isActive) {
      return activeClassName;
    } else {
      return inactiveClassName;
    }
  };

  const icon = getIconByStatus(status);

  return (
    <div
      className={
        classes.container +
        " " +
        (status === DEVICE_STATUS.OFFLINE ? classes.offline : "") +
        getClassNames(classes.activeContainer, classes.inactiveContainer)
      }
    >
      <img
        src={icon[0]}
        alt={status}
        className={`${classes.deviceNode} ${
          isActive ? classes.activeDeviceNode : ""
        }`}
      />

      <img
        src={icon[1]}
        alt={status}
        className={`${classes.deviceNode} ${classes.flickerNode} ${
          isActive ? classes.activeDeviceNode : ""
        }`}
      />
    </div>
  );
};
