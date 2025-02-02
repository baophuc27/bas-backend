import { Box, Grid } from "@material-ui/core";
import { SharedInputField } from "common/components";
import { sensorStatusColor } from "common/constants/berth.constant";
import { t } from "i18next";
import styles from "./berthing-setting-dialog.style.module.css";
import { mapSensorStatusText } from "common/constants/berth.constant";

const BerthingInformation = ({
  sensorSocketData,
  values,
  handleChange,
  errors,
  touched,
  setFieldTouched,
  isRecord,
  dataAppList = [],
  selectedDataApp, 
  onDataAppChange, 
}) => {
  return (
    <div className={styles.section}>
      <Grid container spacing={2}>
        <Grid item xs={6} className={styles.sensorContainer}>
          <strong>{t("berthing:berth_information.left_sensor")}</strong>
          <span
            className={styles.sensorStatus}
            style={{
              backgroundColor: sensorStatusColor(
                sensorSocketData.leftSensorStatusText
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} className={styles.sensorContainer}>
          <strong>{t("berthing:berth_information.right_sensor")}</strong>
          <span
            className={styles.sensorStatus}
            style={{
              backgroundColor: sensorStatusColor(
                sensorSocketData.rightSensorStatusText
              ),
            }}
          />
        </Grid>
      </Grid>

      <Grid container className={styles.sensorDistanceGroup} spacing={2}>
        {sensorSocketData.leftSensorStatusText && (
          <Grid item xs={6}>
            <p className={styles.sensorStatusText}>
              {t("berthing:berth_information.status")}:{" "}
              {t(mapSensorStatusText(sensorSocketData.leftSensorStatusText))}
            </p>
          </Grid>
        )}
        {sensorSocketData.rightSensorStatusText && (
          <Grid item xs={6}>
            <p className={styles.sensorStatusText}>
              {t("berthing:berth_information.status")}:{" "}
              {t(mapSensorStatusText(sensorSocketData.rightSensorStatusText))}
            </p>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={2} className={styles.sensorDistanceGroup}>
        <Grid item xs={6}>
          <Box className="form-label">
            <span className="required">*</span>
            {t(
              "berthing:berth_information.distance_between_left_sensor_and_fender"
            )}
          </Box>
          <Box display="flex" height={"100%"}>
            <div className={styles.distanceInput}>
              <SharedInputField
                type="number"
                name="leftSensorDistance"
                value={values.leftSensorDistance}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^\d+(\.\d{1,2})?$/) || value === "") {
                    handleChange({
                      target: {
                        name: "leftSensorDistance",
                        value: value,
                      },
                    });
                  }
                }}
                errorMsg={
                  touched.leftSensorDistance && errors?.leftSensorDistance
                    ? errors.leftSensorDistance
                    : ""
                }
                inputProps={{
                  min: 0,
                  max: 50,
                }}
                onBlur={() => {
                  setFieldTouched("leftSensorDistance", true);
                }}
                disabled={isRecord}
              />
            </div>
            <div className={styles.currentDistanceBlock}>
              {sensorSocketData?.currentDistanceLeft}
            </div>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className="form-label">
            <span className="required">*</span>
            {t(
              "berthing:berth_information.distance_between_right_sensor_and_fender"
            )}
          </Box>
          <Box display="flex">
            <div className={styles.distanceInput}>
              <SharedInputField
                // label={t(
                //   "berthing:berth_information.distance_between_right_sensor_and_fender"
                // )}
                type="number"
                name="rightSensorDistance"
                value={values.rightSensorDistance}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^\d+(\.\d{1,2})?$/) || value === "") {
                    handleChange({
                      target: {
                        name: "rightSensorDistance",
                        value: value,
                      },
                    });
                  }
                }}
                errorMsg={
                  touched.rightSensorDistance && errors?.rightSensorDistance
                    ? errors.rightSensorDistance
                    : ""
                }
                inputProps={{
                  min: 0,
                  max: 50,
                }}
                className={styles.distanceInput}
                onBlur={() => {
                  setFieldTouched("rightSensorDistance", true);
                }}
                disabled={isRecord}
              />
            </div>
            <div className={styles.currentDistanceBlock}>
              {sensorSocketData?.currentDistanceRight}
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default BerthingInformation;
