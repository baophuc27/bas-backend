import AngleIcon from "assets/images/angle.svg";
import DistanceIcon from "assets/images/distance.svg";
import SpeedIcon from "assets/images/speed.svg";
import {
  MAX_ALARM_HISTORIES_DURATION,
  MAX_ALARM_HISTORIES_UNIT,
} from "common/constants/application.constant";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlarmStatus, AlarmStatusColor } from "../constants/alarm-status";
import { formatValue } from "../helpers";

const { v4: uuidv4 } = require("uuid");

const AlarmTypeIcon = {
  ANGLE: AngleIcon,
  DISTANCE: DistanceIcon,
  SPEED: SpeedIcon,
};
const TIME_FORMAT = "HH:mm:ss:SSS";

export const useAlarmHistoryData = ({
  latestData,
  sensorAId,
  sensorBId,
  sensorAToFender = 0,
  sensorBToFender = 0,
}) => {
  const { t } = useTranslation();
  const [localLatestData, setLocalLatestData] = useState({});
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [rows, setRows] = useState([]);
  const latestAlarms = useRef({
    leftDistance: null,
    rightDistance: null,
    leftSpeed: null,
    rightSpeed: null,
    angle: null,
  });
  const recordsMap = useRef({});

  const handleSpeedAlarm = (side, sensorId, record) => {
    const lastData = latestAlarms.current[`${side}Speed`];
    const newData = {
      uuid: uuidv4(),
      type: "SPEED",
      value: formatValue(record?.speed?.[sensorId]?.value),
      zone: record?.speed?.[sensorId]?.zone,
      status: record?.speed?.[sensorId]?.alarm,
      sensor: sensorId === 1 ? t("alarm:left") : t("alarm:right"),
      startTime: moment(record?.eventTime).format(TIME_FORMAT),
      endTime: "-",
      alarmColor: AlarmStatusColor[record?.speed?.[sensorId]?.alarm],
      iconType: AlarmTypeIcon.SPEED,
    };

    if (lastData === null) {
      latestAlarms.current[`${side}Speed`] = newData;
      recordsMap.current[newData?.uuid] = newData;

      if (record?.speed?.[sensorId]?.alarm !== AlarmStatus.OPERATOR) {
        setRows((prev) => [
          {
            uuid: newData?.uuid,
            timestamp: moment(record?.eventTime).unix(),
          },
          ...prev,
        ]);
      }
    } else {
      if (lastData?.status === newData?.status) {
        // latestAlarms.current[`${side}Speed`].value = newData?.value;
        // recordsMap.current[lastData?.uuid].value = newData?.value;
        // Do nothing
      } else {
        recordsMap.current[lastData?.uuid].endTime = moment(
          record?.eventTime,
        ).format(TIME_FORMAT);

        latestAlarms.current[`${side}Speed`] = newData;
        recordsMap.current[newData?.uuid] = newData;

        if (record?.speed?.[sensorId]?.alarm !== AlarmStatus.OPERATOR) {
          setRows((prev) => [
            {
              uuid: newData?.uuid,
              timestamp: moment(record?.eventTime).unix(),
            },
            ...prev,
          ]);
        }
      }
    }
  };

  const handleDistanceAlarm = (side, sensorId, record) => {
    // NOTES: Only shows alarms for emergency case

    const lastData = latestAlarms.current[`${side}Distance`];
    const newData = {
      uuid: uuidv4(),
      type: "DISTANCE",
      value: record?.distance?.[sensorId]?.value,
      zone: record?.distance?.[sensorId]?.zone,
      status: record?.distance?.[sensorId]?.alarm,
      sensor: sensorId === 1 ? t("alarm:left") : t("alarm:right"),
      startTime: moment(record?.eventTime).format(TIME_FORMAT),
      endTime: "-",
      alarmColor: AlarmStatusColor[record?.distance?.[sensorId]?.alarm],
      iconType: AlarmTypeIcon.DISTANCE,
    };

    if (sensorId === 1) {
      newData["value"] = Math.max(newData["value"] - sensorAToFender, 0);
    }

    if (sensorId === 2) {
      newData["value"] = Math.max(newData["value"] - sensorBToFender, 0);
    }

    newData["value"] = formatValue(newData["value"]);

    if (lastData === null) {
      latestAlarms.current[`${side}Distance`] = newData;
      recordsMap.current[newData?.uuid] = newData;

      if (record?.distance?.[sensorId]?.alarm === AlarmStatus.EMERGENCY) {
        setRows((prev) => [
          {
            uuid: newData?.uuid,
            timestamp: moment(record?.eventTime).unix(),
          },
          ...prev,
        ]);
      }
    } else {
      if (lastData?.status === newData?.status) {
        // latestAlarms.current[`${side}Distance`].value = newData?.value;
        // recordsMap.current[lastData?.uuid].value = newData?.value;
        // Do nothing
      } else {
        recordsMap.current[lastData?.uuid].endTime = moment(
          record?.eventTime,
        ).format(TIME_FORMAT);

        latestAlarms.current[`${side}Distance`] = newData;
        recordsMap.current[newData?.uuid] = newData;

        if (record?.distance?.[sensorId]?.alarm === AlarmStatus.EMERGENCY) {
          setRows((prev) => [
            {
              uuid: newData?.uuid,
              timestamp: moment(record?.eventTime).unix(),
            },
            ...prev,
          ]);
        }
      }
    }
  };

  const handleAngleAlarm = (record) => {
    const lastData = latestAlarms.current["angle"];
    const newData = {
      uuid: uuidv4(),
      type: "ANGLE",
      value: formatValue(record?.angle?.value),
      zone: record?.angle?.zone,
      status: record?.angle?.alarm,
      sensor: "-",
      startTime: moment(record?.eventTime).format(TIME_FORMAT),
      endTime: "-",
      alarmColor: AlarmStatusColor[record?.angle?.alarm],
      iconType: AlarmTypeIcon.ANGLE,
    };

    if (lastData === null) {
      latestAlarms.current["angle"] = newData;
      recordsMap.current[newData?.uuid] = newData;

      if (record?.angle.alarm !== AlarmStatus.OPERATOR) {
        setRows((prev) => [
          {
            uuid: newData?.uuid,
            timestamp: moment(record?.eventTime).unix(),
          },
          ...prev,
        ]);
      }
    } else {
      if (lastData?.status === newData?.status) {
        // latestAlarms.current["angle"].value = newData?.value;
        // recordsMap.current[lastData?.uuid].value = newData?.value;
        // Do nothing
      } else {
        recordsMap.current[lastData?.uuid].endTime = moment(
          record?.eventTime,
        ).format(TIME_FORMAT);

        latestAlarms.current["angle"] = newData;
        recordsMap.current[newData?.uuid] = newData;

        if (record?.angle.alarm !== AlarmStatus.OPERATOR) {
          setRows((prev) => [
            {
              uuid: newData?.uuid,
              timestamp: moment(record?.eventTime).unix(),
            },
            ...prev,
          ]);
        }
      }
    }
  };

  const handleRecord = (record) => {
    // Check to prevent old data being pushed back
    if (
      latestTimestamp !== null &&
      moment(record?.eventTime) < moment(latestTimestamp)
    ) {
      return;
    }

    setLocalLatestData(record);
    setLatestTimestamp(record?.eventTime);

    // DISTANCE
    if (record?.distance && record?.distance?.[sensorAId]) {
      handleDistanceAlarm("left", sensorAId, record);
    }

    if (record?.distance && record?.distance?.[sensorBId]) {
      handleDistanceAlarm("right", sensorBId, record);
    }

    // SPEED
    if (record?.speed && record?.speed?.[sensorAId]) {
      handleSpeedAlarm("left", sensorAId, record);
    }

    if (record?.speed && record?.speed?.[sensorBId]) {
      handleSpeedAlarm("right", sensorBId, record);
    }

    // ANGLE
    if (record?.angle) {
      handleAngleAlarm(record);
    }
  };

  useEffect(() => {
    if (JSON.stringify(latestData) !== JSON.stringify(localLatestData)) {
      handleRecord(latestData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestData]);

  const records = useMemo(() => {
    let itemsCount = 0;

    const minTimestamp = moment(latestTimestamp)
      .subtract(MAX_ALARM_HISTORIES_DURATION, MAX_ALARM_HISTORIES_UNIT)
      .unix();

    const transformedRows = rows?.filter(
      (record) => record?.timestamp >= minTimestamp,
    );

    let results = [];

    for (let row of transformedRows) {
      results.push(recordsMap?.current?.[row?.uuid]);
      itemsCount += 1;
    }

    return {
      rows: results,
      count: itemsCount,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, latestTimestamp]);

  return {
    realtimeData: records?.rows,
    hasRealtimeData: records?.count > 0,
  };
};
