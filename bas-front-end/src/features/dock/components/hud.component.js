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
  sensorAHasErrors = false,
  sensorBHasErrors = false,
}) => {
  const { t } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box className={styles.main}>
        <Box className={styles.sensorInfo}>
          <Box className={styles.sensorInfoTitle}>
            {t("dock:hud.left-sensor")}
            {/* <span style={{ color: "gray" }}>({sensorA?.name})</span> */}
          </Box>

          <Box className={styles.sensorDataGroup}>
            <Box className={styles.sensorData}>
              <Box>{t("dock:hud.speed")} (cm/s)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorAData?.speed_status_id === NORMAL_STATUS_ID
                      ? undefined
                      : AlarmStatusColor[sensorAData?.speed_status_id],
                }}
              >
                {hasData && sensorAData && !sensorAHasErrors
                  ? formatValue(sensorAData?.speed)
                  : "--"}
              </Box>
            </Box>

            <Box className={styles.sensorData}>
              <Box>{t("dock:hud.distance")} (m)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorAData?.distance < 0
                      ? "red"
                      : sensorAData?.distance_status_id === NORMAL_STATUS_ID
                        ? undefined
                        : AlarmStatusColor[sensorAData?.distance_status_id],
                }}
              >
                {hasData && sensorAData && !sensorAHasErrors
                  ? formatValue(sensorAData?.distance)
                  : "--"}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className={styles.angleInfo}>
          <Box>
            <Box>{t("dock:hud.angle")} (°)</Box>
            <Box
              className={styles.dataValue}
              style={{
                color:
                  angleData?.status_id === NORMAL_STATUS_ID
                    ? undefined
                    : AlarmStatusColor[angleData?.status_id],
              }}
            >
              {hasData && angleData && !sensorAHasErrors && !sensorBHasErrors
                ? formatValue(Math.abs(angleData?.value))
                : "--"}
            </Box>
          </Box>
        </Box>

        <Box className={styles.sensorInfo}>
          <Box className={styles.sensorInfoTitle}>
            {t("dock:hud.right-sensor")}
            {/* <span style={{ color: "gray" }}>({sensorB?.name})</span> */}
          </Box>

          <Box className={styles.sensorDataGroup}>
            <Box className={styles.sensorData}>
              <Box>{t("dock:hud.speed")} (cm/s)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorBData?.speed_status_id === NORMAL_STATUS_ID
                      ? undefined
                      : AlarmStatusColor[sensorBData?.speed_status_id],
                }}
              >
                {hasData && sensorBData && !sensorBHasErrors
                  ? formatValue(sensorBData?.speed)
                  : "--"}
              </Box>
            </Box>

            <Box className={styles.sensorData}>
              <Box>{t("dock:hud.distance")} (m)</Box>
              <Box
                className={styles.dataValue}
                style={{
                  color:
                    sensorBData?.distance < 0
                      ? "red"
                      : sensorBData?.distance_status_id === NORMAL_STATUS_ID
                        ? undefined
                        : AlarmStatusColor[sensorBData?.distance_status_id],
                }}
              >
                {hasData && sensorBData && !sensorBHasErrors
                  ? formatValue(sensorBData?.distance)
                  : "--"}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
