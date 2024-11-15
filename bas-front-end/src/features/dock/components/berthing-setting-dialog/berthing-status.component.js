import { Grid } from "@material-ui/core";
import DoubleArrowIcon from "assets/icons/double-arrow.svg";
import { SharedInputField, SharedSelectField } from "common/components";
import { BERTH_STATUS } from "common/constants/berth.constant";
import { t } from "i18next";
import { memo, useMemo } from "react";
import styles from "./berthing-setting-dialog.style.module.css";

const BerthingStatus = ({
  values,
  handleChange,
  errors,
  touched,
  isRecord,
}) => {
  const options = useMemo(() => {
    const result = [];
    switch (BERTH_STATUS[values.currentStatus]) {
      case BERTH_STATUS.DEPARTING:
        result.push({
          value: "AVAILABLE",
          label: t("berthing:status.available"),
        });
        break;
      case BERTH_STATUS.MOORING:
        result.push(
          {
            value: "AVAILABLE",
            label: t("berthing:status.available"),
          },
          // {
          //   value: "BERTHING",
          //   label: t("berthing:status.berthing"),
          // },
          {
            value: "DEPARTING",
            label: t("berthing:status.departing"),
          }
        );
        break;
      case BERTH_STATUS.BERTHING:
        result.push(
          {
            value: "AVAILABLE",
            label: t("berthing:status.available"),
          },
          {
            value: "MOORING",
            label: t("berthing:status.mooring"),
          }
        );
        break;
      case BERTH_STATUS.AVAILABLE:
        result.push(
          {
            value: "BERTHING",
            label: t("berthing:status.berthing"),
          },
          {
            value: "DEPARTING",
            label: t("berthing:status.departing"),
          }
        );
        break;
      default:
        break;
    }
    return result;
  }, [values.currentStatus]);

  const translateCurrentStatus = (status) => {
    switch (status) {
      case "AVAILABLE":
        return t("berthing:status.available");
      case "BERTHING":
        return t("berthing:status.berthing");
      case "MOORING":
        return t("berthing:status.mooring");
      case "DEPARTING":
        return t("berthing:status.departing");
      default:
        return "";
    }
  };

  return (
    <div className={styles.section}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <SharedInputField
            label={t("berthing:berth_status.current_status")}
            placeholder={t("berthing:berth_status.current_status")}
            value={translateCurrentStatus(values.currentStatus)}
            name="currentStatus"
            onChange={handleChange}
            disabled
            errorMsg={touched.currentStatus ? errors.currentStatus : ""}
          />
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 42,
          }}
        >
          <img
            src={DoubleArrowIcon}
            alt="DoubleArrowIcon"
            width={41}
            height={29}
          />
        </Grid>
        <Grid item xs={5}>
          <SharedSelectField
            required={!isRecord}
            options={options}
            label={t("berthing:berth_status.upcoming_status")}
            placeholder={t("berthing:berth_status.upcoming_status")}
            name="upcomingStatus"
            value={options.find(
              (option) => option.value === values.upcomingStatus
            )}
            onChange={(_, value) => {
              handleChange({
                target: {
                  name: "upcomingStatus",
                  value: value ?? "",
                },
              });
            }}
            errorMsg={touched.upcomingStatus ? errors.upcomingStatus : ""}
            className={styles.selectUpcomingStatus}
            readOnly={true}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(BerthingStatus);
