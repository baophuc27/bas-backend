import { Box, IconButton } from "@material-ui/core";
import CropFreeIcon from "@material-ui/icons/CropFree";
import SettingsIcon from "@material-ui/icons/Settings";
import AngleIcon from "assets/images/angle.svg";
import DistanceIcon from "assets/images/distance.svg";
import SpeedIcon from "assets/images/speed.svg";
import {
  MAX_ALARM_HISTORIES_DURATION,
  MAX_ALARM_HISTORIES_UNIT,
} from "common/constants/application.constant";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
import { usePermission } from "common/hooks";
import { BerthService } from "common/services";
import { orderBy } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlarmStatusColor } from "../constants/alarm-status";
import { formatValue, getUnit } from "../helpers";
import { AlarmHistoryModal } from "./alarm-history-modal.component";
import styles from "./alarm-history-table.style.module.css";
const { v4: uuidv4 } = require("uuid");

const AlarmTypeIcon = {
  ANGLE: AngleIcon,
  DISTANCE: DistanceIcon,
  SPEED: SpeedIcon,
};

const createAlarmObject = (
  type,
  sensor,
  latestData,
  statusId,
  value,
  zone,
) => ({
  id: uuidv4(),
  type,
  sensor,
  value,
  zone,
  start_time: latestData?.eventTime,
  end_time: null,
  status: statusId,
});

const updateAlarmsMap = (map, lastId, newId, newAlarm, eventTime) => ({
  ...map,
  [lastId]: {
    ...map?.[lastId],
    end_time: eventTime,
  },
  [newId]: newAlarm,
});

const processAlarmData = (
  latestData,
  sensorData,
  lastAlarmId,
  alarmsMap,
  setLastAlarmId,
  setAlarmsMap,
  setAlarmsArr,
  type,
  sensor,
  unit,
) => {
  if (sensorData?.value === undefined) {
    return;
  }

  if (sensorData?.alarm !== 1) {
    const newId = uuidv4();
    const lastAlarm = alarmsMap?.[lastAlarmId];
    const newAlarm = createAlarmObject(
      type,
      sensor,
      latestData,
      sensorData?.alarm,
      sensorData?.value
        ? `${formatValue(Math.abs(sensorData?.value))}${unit}`
        : "-",
      sensorData?.zone,
    );

    if (newAlarm?.value !== lastAlarm?.value) {
      setAlarmsMap((prev) =>
        updateAlarmsMap(
          prev,
          lastAlarmId,
          newId,
          newAlarm,
          latestData?.eventTime,
        ),
      );
      setLastAlarmId(newId);
      setAlarmsArr((prev) => [
        {
          event_time: moment(latestData?.eventTime).unix(),
          id: newId,
          type,
        },
        ...prev,
      ]);
    }
  }
};

const DataTable = ({ data, tableStyles }) => {
  const { t } = useTranslation();
  const {
    hasData,
    alarmsArr,
    angleAlarmsMap,
    aDistanceAlarmsMap,
    aSpeedAlarmsMap,
    bDistanceAlarmsMap,
    bSpeedAlarmsMap,
    lastRows,
    latestTimestamp,
    apiRows,
  } = data;

  const minTimestamp = moment(latestTimestamp).subtract(
    MAX_ALARM_HISTORIES_DURATION,
    MAX_ALARM_HISTORIES_UNIT,
  );

  const realtimeRows = useMemo(() => {
    return orderBy(
      alarmsArr?.filter(
        (alarm) => moment.unix(alarm?.event_time) >= minTimestamp,
      ),
      ["event_time"],
      ["desc"],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmsArr, latestTimestamp]);

  // const apiRows = useMemo(() => {
  //   return lastRows?.filter(
  //     (row) => moment(row?.eventTime).unix() >= minTimestamp,
  //   );

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lastRows, latestTimestamp]);

  if (apiRows?.length === 0 && alarmsArr?.length === 0) {
    return (
      <Box className={styles.noDataContainer}>
        {/* <img
          src="/images/no-data.jpg"
          alt="No Data"
          className={styles.noDataImage}
        /> */}

        <Box className={styles.noDataText}>{t("common:label.no-data")}</Box>
      </Box>
    );
  }

  return (
    <table className={styles.table} style={tableStyles}>
      <thead>
        <tr>
          <th>{t("dock:alarm-history.type")}</th>
          <th>{t("dock:alarm-history.sensor")}</th>
          <th>{t("dock:alarm-history.value")}</th>
          <th>{t("dock:alarm-history.zone")}</th>
          <th>{t("dock:alarm-history.start-time")}</th>
          <th>{t("dock:alarm-history.end-time")}</th>
        </tr>
      </thead>

      <tbody>
        {realtimeRows?.map(({ id: alarmId, type }) => {
          let record = null;

          if (type === "ANGLE") {
            record = angleAlarmsMap?.[alarmId];
          }

          if (type === "DISTANCE_A") {
            record = aDistanceAlarmsMap?.[alarmId];
          }

          if (type === "SPEED_A") {
            record = aSpeedAlarmsMap?.[alarmId];
          }

          if (type === "DISTANCE_B") {
            record = bDistanceAlarmsMap?.[alarmId];
          }

          if (type === "SPEED_B") {
            record = bSpeedAlarmsMap?.[alarmId];
          }

          return (
            <tr className={styles.tableRow} key={record?.id}>
              <td
                className={styles.tableCell}
                style={{
                  background: AlarmStatusColor[record?.status],
                  textAlign: "center",
                }}
              >
                <img
                  src={AlarmTypeIcon[record?.type?.split("_")?.[0]]}
                  alt=""
                />
              </td>
              <td className={styles.tableCell}>
                <span>
                  {record?.sensor === "-"
                    ? "-"
                    : record?.sensor === 1
                      ? t("alarm:left")
                      : t("alarm:right")}
                </span>
              </td>
              <td className={styles.tableCell}>{record?.value}</td>
              <td className={styles.tableCell}>{record?.zone}</td>
              <td className={styles.tableCell}>
                {moment(record?.start_time).format("HH:mm:ss:SSS")}
              </td>
              <td className={styles.tableCell}>
                {record?.end_time
                  ? moment(record?.end_time).format("HH:mm:ss:SSS")
                  : "-"}
              </td>
            </tr>
          );
        })}

        {apiRows?.map((record, index) => (
          <tr className={styles.tableRow} key={index}>
            <td
              className={styles.tableCell}
              style={{
                background: AlarmStatusColor[record?.alarm],
                textAlign: "center",
              }}
            >
              <img src={AlarmTypeIcon[record?.type?.toUpperCase()]} alt="" />
            </td>
            <td className={styles.tableCell}>
              {record?.side ? (
                <span>
                  {record?.side === 1 ? t("alarm:left") : t("alarm:right")}
                </span>
              ) : (
                <span>-</span>
              )}
            </td>
            <td className={styles.tableCell}>
              {formatValue(Math.abs(record?.value))}
              {getUnit(record?.type)}
            </td>
            <td className={styles.tableCell}>{record?.zone}</td>
            <td className={styles.tableCell}>
              {moment(record?.startTime).format("HH:mm:ss:SSS")}
            </td>
            <td className={styles.tableCell}>
              {record?.endTime
                ? moment(record?.endTime).format("HH:mm:ss:SSS")
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AlarmHistoryTable = ({
  hasData,
  latestData,
  sensorAId,
  sensorBId,
  onClickSettings = () => {},
  berthStatus,
  berthId,
  sensorAToFender = 0,
  sensorBToFender = 0,
}) => {
  const { t } = useTranslation();
  const [localLatestData, setLocalLatestData] = useState({});
  const [angleLastAlarmId, setAngleLastAlarmId] = useState("");
  const [angleAlarmsMap, setAngleAlarmsMap] = useState({});
  const [aLastDistanceAlarmId, setALastDistanceAlarmId] = useState("");
  const [aDistanceAlarmsMap, setADistanceAlarmsMap] = useState({});
  const [aLastSpeedAlarmId, setALastSpeedAlarmId] = useState("");
  const [aSpeedAlarmsMap, setASpeedAlarmsMap] = useState({});
  const [bLastDistanceAlarmId, setBLastDistanceAlarmId] = useState("");
  const [bDistanceAlarmsMap, setBDistanceAlarmsMap] = useState({});
  const [bLastSpeedAlarmId, setBLastSpeedAlarmId] = useState("");
  const [bSpeedAlarmsMap, setBSpeedAlarmsMap] = useState({});
  const [alarmsArr, setAlarmsArr] = useState([]);
  const [showsHistoryFullScreen, setShowHistoryFullScreen] = useState(false);
  const [localBerthStatus, setLocalBerthStatus] = useState(-1);
  const [lastDataReady, setLastDataReady] = useState(false);
  const [lastRows, setLastRows] = useState([]);
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [apiRows, setApiRows] = useState([]);
  const { hasPermission } = usePermission();

  const toggleShowsHistoryFullScreen = () =>
    setShowHistoryFullScreen((prev) => !prev);

  const fetchInitialData = async () => {
    try {
      const response = await BerthService.getLatestRecords(
        berthId,
        moment()?.subtract(2, "hours")?.format("YYYY-MM-DD HH:mm:ss:SSS"),
        moment()?.format("YYYY-MM-DD HH:mm:ss:SSS"),
      );
      console.log("response", response);

      if (response?.data?.success) {
        // const dataPoints = response?.data?.record?.slice(0, 100);

        // let latestData = [];
        // let lastData = [];

        // if (dataPoints?.[0]) {
        //   setLatestTimestamp(dataPoints?.[0]?.startTime);
        // }

        // for (let dataPoint of dataPoints) {
        //   dataPoint["side"] = dataPoint?.side === 0 ? sensorAId : sensorBId;
        //   dataPoint["eventTime"] = dataPoint?.startTime;

        //   if (dataPoint?.endTime === null) {
        //     latestData?.push(dataPoint);
        //   } else {
        //     lastData?.push(dataPoint);
        //   }
        // }

        // for (let dataPoint of latestData) {
        //   if (dataPoint?.type === "speed") {
        //     if (dataPoint?.side === sensorAId) {
        //       processAlarmData(
        //         dataPoint,
        //         {
        //           alarm: dataPoint?.alarm,
        //           value: dataPoint?.value,
        //           zone: dataPoint?.zone,
        //         },
        //         aLastSpeedAlarmId,
        //         aSpeedAlarmsMap,
        //         setALastSpeedAlarmId,
        //         setASpeedAlarmsMap,
        //         setAlarmsArr,
        //         "SPEED_A",
        //         sensorAId,
        //         " cm/s",
        //       );
        //     }

        //     if (dataPoint?.side === sensorBId) {
        //       processAlarmData(
        //         dataPoint,
        //         {
        //           alarm: dataPoint?.alarm,
        //           value: dataPoint?.value,
        //           zone: dataPoint?.zone,
        //         },
        //         bLastSpeedAlarmId,
        //         bSpeedAlarmsMap,
        //         setBLastSpeedAlarmId,
        //         setBSpeedAlarmsMap,
        //         setAlarmsArr,
        //         "SPEED_B",
        //         sensorBId,
        //         " cm/s",
        //       );
        //     }
        //   }

        //   if (dataPoint?.type === "distance") {
        //     if (dataPoint?.side === sensorAId) {
        //       processAlarmData(
        //         dataPoint,
        //         {
        //           alarm: dataPoint?.alarm,
        //           value: dataPoint?.value,
        //           zone: dataPoint?.zone,
        //         },
        //         aLastDistanceAlarmId,
        //         aDistanceAlarmsMap,
        //         setALastDistanceAlarmId,
        //         setADistanceAlarmsMap,
        //         setAlarmsArr,
        //         "DISTANCE_A",
        //         sensorAId,
        //         " m",
        //       );
        //     }

        //     if (dataPoint?.side === sensorBId) {
        //       processAlarmData(
        //         dataPoint,
        //         {
        //           alarm: dataPoint?.alarm,
        //           value: dataPoint?.value,
        //           zone: dataPoint?.zone,
        //         },
        //         bLastDistanceAlarmId,
        //         bDistanceAlarmsMap,
        //         setBLastDistanceAlarmId,
        //         setBDistanceAlarmsMap,
        //         setAlarmsArr,
        //         "DISTANCE_B",
        //         sensorBId,
        //         " m",
        //       );
        //     }
        //   }

        //   if (dataPoint?.type === "angle") {
        //     processAlarmData(
        //       dataPoint,
        //       {
        //         alarm: dataPoint?.alarm,
        //         value: dataPoint?.value,
        //         zone: dataPoint?.zone,
        //       },
        //       angleLastAlarmId,
        //       angleAlarmsMap,
        //       setAngleLastAlarmId,
        //       setAngleAlarmsMap,
        //       setAlarmsArr,
        //       "ANGLE",
        //       "-",
        //       "°",
        //     );
        //   }
        // }

        // setLastRows(lastData);
        // setLastDataReady(true);

        const dataPoints = response?.data?.record;
        setApiRows(dataPoints);
        setLastDataReady(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchInitialData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      lastDataReady &&
      JSON.stringify(latestData) !== JSON.stringify(localLatestData)
    ) {
      setLocalLatestData(latestData);
      setLatestTimestamp(latestData?.eventTime);

      processAlarmData(
        latestData,
        latestData.angle,
        angleLastAlarmId,
        angleAlarmsMap,
        setAngleLastAlarmId,
        setAngleAlarmsMap,
        setAlarmsArr,
        "ANGLE",
        "-",
        "°",
      );

      processAlarmData(
        latestData,
        // {
        //   ...latestData?.distance?.[sensorAId],
        //   value: Math.max(
        //     latestData?.distance?.[sensorAId]?.value - sensorAToFender,
        //     0,
        //   ),
        // },
        latestData?.distance?.[sensorAId],
        aLastDistanceAlarmId,
        aDistanceAlarmsMap,
        setALastDistanceAlarmId,
        setADistanceAlarmsMap,
        setAlarmsArr,
        "DISTANCE_A",
        sensorAId,
        " m",
      );

      processAlarmData(
        latestData,
        // {
        //   ...latestData?.distance?.[sensorBId],
        //   value: Math.max(
        //     latestData?.distance?.[sensorBId]?.value - sensorBToFender,
        //     0,
        //   ),
        // },
        latestData?.distance?.[sensorBId]?.value,
        bLastDistanceAlarmId,
        bDistanceAlarmsMap,
        setBLastDistanceAlarmId,
        setBDistanceAlarmsMap,
        setAlarmsArr,
        "DISTANCE_B",
        sensorBId,
        " m",
      );

      processAlarmData(
        latestData,
        latestData?.speed?.[sensorAId],
        aLastSpeedAlarmId,
        aSpeedAlarmsMap,
        setALastSpeedAlarmId,
        setASpeedAlarmsMap,
        setAlarmsArr,
        "SPEED_A",
        sensorAId,
        " cm/s",
      );

      processAlarmData(
        latestData,
        latestData?.speed?.[sensorBId],
        bLastSpeedAlarmId,
        bSpeedAlarmsMap,
        setBLastSpeedAlarmId,
        setBSpeedAlarmsMap,
        setAlarmsArr,
        "SPEED_B",
        sensorBId,
        " cm/s",
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastDataReady, latestData]);

  useEffect(() => {
    if (berthStatus !== localBerthStatus) {
      setLocalBerthStatus(berthStatus);
      setAlarmsArr([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [berthStatus]);

  return (
    <Box
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      p={2}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <p className={styles.mainTitle}>{t("dock:alarm-history.title")}</p>

        <Box display="flex">
          {hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT) && (
            <IconButton onClick={onClickSettings} disableRipple>
              <SettingsIcon />
            </IconButton>
          )}

          <IconButton onClick={toggleShowsHistoryFullScreen} disableRipple>
            <CropFreeIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            flex: 1,
            overflowY: alarmsArr?.length === 0 ? "unset" : "auto",
          }}
        >
          <DataTable
            data={{
              hasData,
              alarmsArr,
              angleAlarmsMap,
              aDistanceAlarmsMap,
              aSpeedAlarmsMap,
              bDistanceAlarmsMap,
              bSpeedAlarmsMap,
              lastRows,
              latestTimestamp,
              apiRows,
            }}
          />
        </Box>
      </Box>

      <AlarmHistoryModal
        visible={showsHistoryFullScreen}
        onClose={toggleShowsHistoryFullScreen}
      >
        <DataTable
          data={{
            hasData,
            alarmsArr,
            angleAlarmsMap,
            aDistanceAlarmsMap,
            aSpeedAlarmsMap,
            bDistanceAlarmsMap,
            bSpeedAlarmsMap,
            lastRows,
            latestTimestamp,
            apiRows,
          }}
          tableStyles={{
            width: "100%",
          }}
        />
      </AlarmHistoryModal>
    </Box>
  );
};
