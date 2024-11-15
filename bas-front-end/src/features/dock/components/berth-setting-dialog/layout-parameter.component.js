import { Grid } from "@material-ui/core";
import { SharedInputField } from "common/components";
import { t } from "i18next";
import styles from "./berth-setting-dialog.style.module.css";

const LayoutParameter = ({
  values,
  handleChange,
  touched,
  errors,
  setFieldTouched,
}) => {
  return (
    <div className={styles.section}>
      <Grid container spacing={2}>
        <Grid item xs={6} className={styles.sensorContainer}>
          <strong className={styles.sensorText}>
            {t("berth:dock_information.left_sensor")}
          </strong>
          {/* <span
            className={styles.sensorStatus}
            style={{
              backgroundColor: sensorStatusColor(values.leftSensorStatusText),
            }}
          /> */}
        </Grid>
        <Grid item xs={6} className={styles.sensorContainer}>
          <strong className={styles.sensorText}>
            {t("berth:dock_information.right_sensor")}
          </strong>
          {/* <span
            className={styles.sensorStatus}
            style={{
              backgroundColor: sensorStatusColor(values.rightSensorStatusText),
            }}
          /> */}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SharedInputField
            label={t(
              "berth:dock_information.distance_from_left_sensor_to_fender"
            )}
            name="leftSensorDistance"
            value={values.leftSensorDistance}
            type="number"
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^\d{1,}(\.\d{1,2})?$/) || value === "") {
                handleChange({
                  target: {
                    name: "leftSensorDistance",
                    value: value,
                  },
                });
              }
            }}
            required
            errorMsg={
              touched.leftSensorDistance ? errors.leftSensorDistance : ""
            }
            onBlur={() => {
              setFieldTouched("leftSensorDistance", true);
            }}
            inputProps={{
              min: 0,
              max: 50,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <SharedInputField
            label={t(
              "berth:dock_information.distance_from_right_sensor_to_fender"
            )}
            name="rightSensorDistance"
            value={values.rightSensorDistance}
            type="number"
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^\d{1,}(\.\d{1,2})?$/) || value === "") {
                handleChange({
                  target: {
                    name: "rightSensorDistance",
                    value: value,
                  },
                });
              }
            }}
            required
            errorMsg={
              touched.rightSensorDistance ? errors.rightSensorDistance : ""
            }
            onBlur={() => {
              setFieldTouched("rightSensorDistance", true);
            }}
            inputProps={{
              min: 0,
              max: 50,
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SharedInputField
            label={
              t(
                "berth:parameter_berth_layout.distance_from_left_sensor_to_left_edge"
              ) + " (m)"
            }
            placeholder={
              t(
                "berth:parameter_berth_layout.distance_from_left_sensor_to_left_edge"
              ) + " (m)"
            }
            type="number"
            name="leftSensorDistanceToEdge"
            value={values.leftSensorDistanceToEdge}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^\d{1,}(\.\d{1,2})?$/) || value === "") {
                handleChange({
                  target: {
                    name: "leftSensorDistanceToEdge",
                    value: value,
                  },
                });
              }
            }}
            required
            errorMsg={
              touched.leftSensorDistanceToEdge
                ? errors.leftSensorDistanceToEdge
                : ""
            }
          />
        </Grid>
        <Grid item xs={6}>
          <SharedInputField
            label={
              t("berth:parameter_berth_layout.distance_between_two_sensors") +
              " (m)"
            }
            placeholder={
              t("berth:parameter_berth_layout.distance_between_two_sensors") +
              " (m)"
            }
            type="number"
            name="distantBetweenSensors"
            value={values.distantBetweenSensors}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^\d{1,}(\.\d{1,2})?$/) || value === "") {
                handleChange({
                  target: {
                    name: "distantBetweenSensors",
                    value: value,
                  },
                });
              }
            }}
            required
            errorMsg={
              touched.distantBetweenSensors ? errors.distantBetweenSensors : ""
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default LayoutParameter;
