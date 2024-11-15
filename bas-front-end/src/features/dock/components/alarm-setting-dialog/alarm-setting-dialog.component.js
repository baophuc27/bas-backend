import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ModalButtons } from "common/components";
import { AlarmService } from "common/services/alarm.service";
import { notify } from "common/utils";
import { t } from "i18next";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./alarm-setting-dialog.style.module.css";
import AlarmTable from "./alarm-table.component";

const AlarmSettingDialog = forwardRef(({ open, handleClose }, ref) => {
  const [alarmData, setAlarmData] = useState({
    zone_1: null,
    zone_2: null,
    zone_3: null,
  });
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params.id;

  // 1: operator, 2: warning, 3: emergency
  const mapSideData = (data, type) => {
    if (!data) {
      return {};
    }
    const operator = {};
    const warning = {};
    const emergency = {};
    for (let i = 0; i <= 2; i += 1) {
      if (data[i]?.status_id === 1) {
        // status_id: 1 is operator
        operator.leftCondition =
          type === "distance" ? ">=" : type === "angle" ? "<=" : "<";
        operator.leftValue =
          type === "distance"
            ? data[i]?.defaultValue
            : type === "angle"
            ? 0
            : "";
        operator.rightCondition = data[i]?.operator;
        operator.rightValue = data[i]?.value;
        operator.message = data[i]?.message;
        operator.alarmSettingId = data[i]?.alarmSettingId;
      } else if (data[i]?.status_id === 2) {
        // status_id: 2 is warning
        warning.leftCondition = type === "distance" ? ">" : "<";
        warning.leftValue = data[i - 1]?.value;
        warning.rightCondition = data[i]?.operator;
        warning.rightValue = data[i]?.value;
        warning.message = data[i]?.message;
        warning.alarmSettingId = data[i]?.alarmSettingId;
      } else if (data[i]?.status_id === 3) {
        // status_id: 3 is emergency
        emergency.leftCondition = type === "distance" ? ">" : "<";
        emergency.leftValue = data[i - 1]?.value;
        emergency.rightCondition = data[i]?.operator;
        emergency.rightValue = data[i]?.value ?? "";
        emergency.message = data[i]?.message;
        emergency.alarmSettingId = data[i]?.alarmSettingId;
      }
    }
    return {
      operator,
      warning,
      emergency,
    };
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await AlarmService.getSettingDetail(id);
    setLoading(false);
    if (response.data?.success) {
      const data = response?.data?.data;
      setAlarmData({
        zone_1: {
          distance: {
            left_sensor: mapSideData(
              data?.zone_1?.distance?.left_sensor,
              "distance"
            ),
            right_sensor: mapSideData(
              data?.zone_1?.distance?.right_sensor,
              "distance"
            ),
          },
          angle: {
            undefined: mapSideData(data?.zone_1?.angle, "angle"),
          },
          speed: {
            left_sensor: mapSideData(data?.zone_1?.speed?.left_sensor),
            right_sensor: mapSideData(data?.zone_1?.speed?.right_sensor),
          },
        },
        zone_2: {
          angle: {
            undefined: mapSideData(data?.zone_2?.angle, "angle"),
          },
          speed: {
            left_sensor: mapSideData(data?.zone_2?.speed?.left_sensor),
            right_sensor: mapSideData(data?.zone_2?.speed?.right_sensor),
          },
        },
        zone_3: {
          angle: {
            undefined: mapSideData(data?.zone_3?.angle, "angle"),
          },
          speed: {
            left_sensor: mapSideData(data?.zone_3?.speed?.left_sensor),
            right_sensor: mapSideData(data?.zone_3?.speed?.right_sensor),
          },
        },
      });
      return;
    }
    notify("error", response.data?.message);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  return (
    <Dialog
      open={open ?? true}
      onClose={handleClose}
      maxWidth="lg"
      style={{ padding: 0 }}
    >
      {loading && (
        <div className={styles.loading}>
          <CircularProgress
            color="inherit"
            size={24}
            style={{ marginLeft: "5px" }}
          />
        </div>
      )}
      <DialogTitle
        style={{
          paddingBottom: 0,
        }}
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalTitle}>{t("alarm:alarm_setting")}</p>
          </div>
          <IconButton
            className={styles.closeButton}
            onClick={handleClose}
            disableRipple
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent
        style={{
          padding: 0,
          minWidth: 300,
        }}
      >
        {Object.keys(alarmData ?? {})?.length !== 0 ? (
          <div className={styles.modalContainer}>
            <p className={`${styles.zoneTitle} ${styles.zoneNoMargin}`}>
              {t("berth:general_information.zone")} 1
            </p>
            <AlarmTable
              title={t("alarm:distance")}
              distanceRows={alarmData.zone_1?.distance}
              angleRows={alarmData.zone_1?.angle}
              speedRows={alarmData.zone_1?.speed}
              setData={(newData, key, side) =>
                setAlarmData({
                  ...alarmData,
                  zone_1: {
                    ...alarmData.zone_1,
                    [key]: {
                      ...alarmData.zone_1[key],
                      [side]: newData,
                    },
                  },
                })
              }
              setLoading={setLoading}
              zone={1}
            />

            <p className={styles.zoneTitle}>
              {t("berth:general_information.zone")} 2
            </p>
            <AlarmTable
              title={t("alarm:speed")}
              speedRows={alarmData.zone_2?.speed}
              angleRows={alarmData.zone_2?.angle}
              setData={(newData, key, side) =>
                setAlarmData({
                  ...alarmData,
                  zone_2: {
                    ...alarmData.zone_2,
                    [key]: {
                      ...alarmData.zone_2[key],
                      [side]: newData,
                    },
                  },
                })
              }
              setLoading={setLoading}
              zone={2}
            />

            <p className={styles.zoneTitle}>
              {t("berth:general_information.zone")} 3
            </p>
            <AlarmTable
              title={t("alarm:speed")}
              speedRows={alarmData?.zone_3?.speed}
              angleRows={alarmData?.zone_3?.angle}
              setData={(newData, key, side) =>
                setAlarmData({
                  ...alarmData,
                  zone_3: {
                    ...alarmData.zone_3,
                    [key]: {
                      ...alarmData.zone_3[key],
                      [side]: newData,
                    },
                  },
                })
              }
              setLoading={setLoading}
              zone={3}
            />
          </div>
        ) : (
          <p className={styles.noData}>{t("alarm:no_data")}</p>
        )}
      </DialogContent>

      {Object.keys(alarmData ?? {})?.length !== 0 && (
        <DialogActions className={styles.saveButton}>
          <ModalButtons onCancel={() => handleClose()} disabled={loading} />
        </DialogActions>
      )}
    </Dialog>
  );
});

export default AlarmSettingDialog;
