import { Grid } from "@material-ui/core";
import { SharedInputField } from "common/components";
import { t } from "i18next";
import styles from "./berth-setting-dialog.style.module.css";

const GeneralInformation = ({
  values,
  handleChange,
  errors,
  touched,
  setFieldTouched,
}) => {
  return (
    <div className={styles.section}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SharedInputField
            label={t("berth:general_information.berth_name")}
            placeholder={t("berth:general_information.berth_name")}
            value={values.berthName}
            name="berthName"
            onChange={handleChange}
            errorMsg={touched.berthName ? errors.berthName : ""}
            required
            onBlur={() => setFieldTouched("berthName", true)}
          />
        </Grid>
        <Grid item xs={6}>
          <SharedInputField
            label={t("berth:general_information.berth_direction")}
            placeholder={t("berth:general_information.berth_direction")}
            type="number"
            name="berthDirection"
            value={values.berthDirection}
            onChange={(e) => {
              const value = e.target.value;
              if (!touched.berthDirection) {
                setFieldTouched("berthDirection", true);
              }
              if (value.match(/^-?\d+(\.\d{1,2})?$/) || value === "") {
                handleChange({
                  target: {
                    name: "berthDirection",
                    value: value,
                  },
                });
              }
            }}
            errorMsg={touched.berthDirection ? errors.berthDirection : ""}
            required
            onBlur={() => setFieldTouched("berthDirection", true)}
          />
        </Grid>
      </Grid>

      <p className={styles.zoneTitle}>{t("berth:general_information.zone")}</p>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <SharedInputField
            label={t("berth:general_information.limit_zone") + " 1 (m)"}
            placeholder={t("berth:general_information.limit_zone") + " 1 (m)"}
            required
            type="number"
            name="limitZone1"
            value={values.limitZone1}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^-?\d{1,}(\.\d{1,2})?$/) || value === "") {
                if (!touched.limitZone1) {
                  setFieldTouched("limitZone1", true);
                }
                handleChange({
                  target: {
                    name: "limitZone1",
                    value: value,
                  },
                });
              }
            }}
            errorMsg={touched.limitZone1 ? errors.limitZone1 : ""}
            inputProps={{
              min: 0,
              max: 300,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <SharedInputField
            label={t("berth:general_information.limit_zone") + " 2 (m)"}
            placeholder={t("berth:general_information.limit_zone") + " 2 (m)"}
            required
            type="number"
            name="limitZone2"
            value={values.limitZone2}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^-?\d{1,}(\.\d{1,2})?$/) || value === "") {
                if (!touched.limitZone2) {
                  setFieldTouched("limitZone2", true);
                }
                handleChange({
                  target: {
                    name: "limitZone2",
                    value: value,
                  },
                });
              }
            }}
            errorMsg={touched.limitZone2 ? errors.limitZone2 : ""}
            inputProps={{
              min: 0,
              max: 300,
            }}
          />
        </Grid>{" "}
        <Grid item xs={4}>
          <SharedInputField
            label={t("berth:general_information.limit_zone") + " 3 (m)"}
            placeholder={t("berth:general_information.limit_zone") + " 3 (m)"}
            required
            type="number"
            name="limitZone3"
            value={values.limitZone3}
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/^-?\d{1,}(\.\d{1,2})?$/) || value === "") {
                if (!touched.limitZone3) {
                  setFieldTouched("limitZone3", true);
                }
                handleChange({
                  target: {
                    name: "limitZone3",
                    value: value,
                  },
                });
              }
            }}
            errorMsg={touched.limitZone3 ? errors.limitZone3 : ""}
            inputProps={{
              min: 0,
              max: 300,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default GeneralInformation;
