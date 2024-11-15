import { Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { AlarmStatusColor, NORMAL_STATUS_ID } from "../constants/alarm-status";
import { formatValue } from "../helpers";
import styles from "./hud.style.module.css";

export const Hud = ({
  sensorAData,
  sensorBData,
  angleData,
  hasData = false,
}) => {
  const { t } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box className={styles.main}>
        <Box className={styles.sensorInfo}>
          <Box className={styles.sensorInfoTitle}>
            {t("replay:hud.left-sensor")}
          </Box>

          <Box className={styles.sensorDataGroup}>
            <Box className={styles.sensorData}>
              <Box>{t("replay:hud.speed")} (cm/s)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorAData?.speed_status_id === NORMAL_STATUS_ID
                      ? undefined
                      : AlarmStatusColor[sensorAData?.speed_status_id],
                }}
              >
                {hasData ? formatValue(sensorAData?.speed) : "--"}
              </Box>
            </Box>

            <Box className={styles.sensorData}>
              <Box>{t("replay:hud.distance")} (m)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorAData?.distance_status_id === NORMAL_STATUS_ID
                      ? undefined
                      : AlarmStatusColor[sensorAData?.distance_status_id],
                }}
              >
                {hasData ? formatValue(sensorAData?.distance) : "--"}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className={styles.angleInfo}>
          <Box>
            <Box>{t("replay:hud.angle")} (°)</Box>
            <Box
              className={styles.dataValue}
              style={{
                color:
                  angleData?.status_id === NORMAL_STATUS_ID
                    ? undefined
                    : AlarmStatusColor[angleData?.status_id],
              }}
            >
              {hasData ? formatValue(Math.abs(angleData?.value)) : "--"}
            </Box>
          </Box>
        </Box>

        <Box className={styles.sensorInfo}>
          <Box className={styles.sensorInfoTitle}>
            {t("replay:hud.right-sensor")}
          </Box>

          <Box className={styles.sensorDataGroup}>
            <Box className={styles.sensorData}>
              <Box>{t("replay:hud.speed")} (cm/s)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorBData?.speed_status_id === NORMAL_STATUS_ID
                      ? undefined
                      : AlarmStatusColor[sensorBData?.speed_status_id],
                }}
              >
                {hasData ? formatValue(sensorBData?.speed) : "--"}
              </Box>
            </Box>

            <Box className={styles.sensorData}>
              <Box>{t("replay:hud.distance")} (m)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorBData?.distance_status_id === NORMAL_STATUS_ID
                      ? undefined
                      : AlarmStatusColor[sensorBData?.distance_status_id],
                }}
              >
                {hasData ? formatValue(sensorBData?.distance) : "--"}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
