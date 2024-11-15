import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ModalButtons } from "common/components";
import {
  BERTH_STATUS,
  BERTH_STATUS_CODE,
} from "common/constants/berth.constant";
import { BerthService } from "common/services";
import { notify } from "common/utils";
import { useFormik } from "formik";
import { t } from "i18next";
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import * as Yup from "yup";
import BerthingInformation from "./berthing-information.component";
import styles from "./berthing-setting-dialog.style.module.css";
import BerthingStatus from "./berthing-status.component";
import VesselInformation from "./vessel-information.component";

const BerthingSettingDialog = ({
  open,
  handleClose,
  data,
  setData,
  socketData,
  refetchAlarmData,
}) => {
  const params = useParams();
  const id = params?.id;
  const berthStatus = useSelector((state) => state.enumeration.berth_statuses);
  const [loading, setLoading] = useState(false);
  const [sensorSocketData, setSensorSocketData] = useState({
    currentDistanceLeft: "",
    currentDistanceRight: "",
    leftSensorStatus: "",
    leftSensorStatusText: "",
    rightSensorStatus: "",
    rightSensorStatusText: "",
  });

  const _handleClose = (params) => {
    setValues((prev) => ({
      ...prev,
      currentStatus: berthStatus?.[data?.status?.id]?.code,
      upcomingStatus: "",

      leftSensorDistance: data?.distanceToLeft,
      rightSensorDistance: data?.distanceToRight,

      // TODO: vessel information
    }));
    handleClose(params);
  };

  const handleUpdate = async (values) => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await BerthService.updateConfig(id, {
        status: BERTH_STATUS[values.upcomingStatus || values.currentStatus],
        distanceToLeft: values.leftSensorDistance,
        distanceToRight: values.rightSensorDistance,
        // TODO: vessel information
        vessel: {
          code: values.vesselIMO,
          name: values.vesselName,
          nameEn: values?.vesselName,
          flag: values.vesselFlag,
          length: values.vesselLength,
          beam: values.vesselBeam,
          type: values.vesselType || undefined,
          builder: values.vesselBuilder || undefined,
          built: values.vesselBuilt || undefined,
          owner: values.vesselOwner || undefined,
          manager: values.vesselManager || undefined,
          maxDraught: values.vesselMaxDraught
            ? +values.vesselMaxDraught
            : undefined,
          class: values.vesselClass || undefined,
          nt: values.vesselNT ? +values.vesselNT : undefined,
          gt: values.vesselGT ? +values.vesselGT : undefined,
          teu: values.vesselTEU ? values.vesselTEU : undefined,
          dwt: values.vesselDWT ? +values.vesselDWT : undefined,
          gas: values.vesselGas ? +values.vesselGas : undefined,
          crude: values.vesselCRUDE ? +values.vesselCRUDE : undefined,
          longitude: values.vesselLongitude
            ? +values.vesselLongitude
            : undefined,
          latitude: values.vesselLatitude ? +values.vesselLatitude : undefined,
          heading: values.vesselHeading ? +values?.vesselHeading : undefined,
          speed: values.vesselSpeed ? +values?.vesselSpeed : undefined,
          callSign: values.vesselCallSign || undefined,
        },
        vesselDirection: values.vesselDirection ? true : false,
      });
      setLoading(false);
      if (!result?.data?.success) {
        notify("error", t("berthing:confirm.error"));
        return;
      }
      if (BERTH_STATUS[values.currentStatus] === BERTH_STATUS.AVAILABLE) {
        refetchAlarmData();
      }
      _handleClose({
        forcesBack: values?.upcomingStatus === BERTH_STATUS.AVAILABLE,
      });
      const _status =
        BERTH_STATUS[values.upcomingStatus || values.currentStatus];
      setData((prev) => ({
        ...prev,
        status: {
          id: _status,
          code: values.upcomingStatus,
          nameEn: berthStatus?.[_status]?.nameEn,
          name: berthStatus?.[_status]?.name,
        },
        distanceToLeft: values.leftSensorDistance,
        distanceToRight: values.rightSensorDistance,
        currentVessel: {
          //  TODO: vessel information
          ...prev.currentVessel,
          code: values.vesselIMO,
          name: values.vesselName,
        },
        vesselDirection: values.vesselDirection ? true : false,
      }));
      return true;
    } catch (error) {
      setLoading(false);
      notify("error", t("berthing:confirm.error"));
      return false;
    }
  };

  const handleReset = (values) => {
    if (!id) return;
    setLoading(true);
    BerthService.reset(id)
      .then((result) => {
        setLoading(false);
        if (!result?.data?.success) {
          notify("error", t("berthing:confirm.error"));
          return;
        }
        notify("success", t("berthing:confirm.reset_success"));

        _handleClose({
          forcesBack:
            BERTH_STATUS[values?.upcomingStatus] === BERTH_STATUS.AVAILABLE,
        });
        setData(result?.data?.data);
      })
      .catch(() => {
        setLoading(false);
        notify("error", t("berthing:confirm.error"));
      });
  };

  const handleFinishSession = () => {
    if (!id) return;
    setLoading(true);
    BerthService.finishSession(id)
      .then((result) => {
        setLoading(false);
        if (!result?.data?.success) {
          notify("error", t("berthing:confirm.error"));
          return;
        }

        notify("success", t("berthing:confirm.vessel_is_mooring."));

        if (result?.data?.isSync === true) {
          notify("success", t("dock:messages.sync-success"));
        } else {
          notify("error", t("dock:messages.sync-error"));
        }

        _handleClose({
          forcesBack: true,
        });
        setData((prev) => ({
          ...prev,
          status: {
            ...prev.status,
            id: BERTH_STATUS[values.upcomingStatus],
            code: values.upcomingStatus,
          },
          distanceToLeft: values.leftSensorDistance,
          distanceToRight: values.rightSensorDistance,
          currentVessel: {
            // TODO: vessel information
            ...prev.currentVessel,
            code: values.vesselIMO,
            name: values.vesselName,
          },
          vesselDirection: values.vesselDirection ? true : false,
        }));
      })
      .catch(() => {
        setLoading(false);
        notify("error", t("berthing:confirm.error"));
      });
  };

  const handleConfirm = async () => {
    setTouched({});
    if (!values.upcomingStatus) {
      handleUpdate(values).then((res) => {
        if (res) notify("success", t("berthing:confirm.update_success"));
      });
    }
    if (
      BERTH_STATUS[values.currentStatus] === BERTH_STATUS.AVAILABLE &&
      BERTH_STATUS[values.upcomingStatus] === BERTH_STATUS.BERTHING
    ) {
      handleUpdate(values).then((res) => {
        if (res) notify("success", t("berthing:confirm.vessel_is_berthing."));
      });
    }
    if (
      BERTH_STATUS[values.currentStatus] === BERTH_STATUS.AVAILABLE &&
      BERTH_STATUS[values.upcomingStatus] === BERTH_STATUS.DEPARTING
    ) {
      handleUpdate(values).then((res) => {
        if (res) notify("success", t("berthing:confirm.vessel_is_departing."));
      });
    }
    if (
      BERTH_STATUS[values.currentStatus] === BERTH_STATUS.MOORING &&
      BERTH_STATUS[values.upcomingStatus] === BERTH_STATUS.DEPARTING
    ) {
      handleUpdate(values).then((res) => {
        if (res) notify("success", t("berthing:confirm.vessel_is_departing."));
      });
    }
    if (
      BERTH_STATUS[values.currentStatus] === BERTH_STATUS.BERTHING &&
      BERTH_STATUS[values.upcomingStatus] === BERTH_STATUS.MOORING
    ) {
      handleFinishSession();
    }
    if (
      ((BERTH_STATUS[values.currentStatus] === BERTH_STATUS.DEPARTING ||
        BERTH_STATUS[values.currentStatus] === BERTH_STATUS.BERTHING ||
        BERTH_STATUS[values.currentStatus] === BERTH_STATUS.MOORING) &&
        BERTH_STATUS[values.upcomingStatus] === BERTH_STATUS.AVAILABLE) ||
      (BERTH_STATUS[values.currentStatus] === BERTH_STATUS.MOORING &&
        BERTH_STATUS[values.upcomingStatus] === BERTH_STATUS.BERTHING)
    ) {
      swal({
        title: t("berthing:confirm.confirm"),
        text: t("berthing:confirm.reset_confirm"),
        icon: "warning",
        buttons: [t("common:button.cancel"), t("common:button.ok")],
        dangerMode: true,
      }).then(async (willConfirm) => {
        if (willConfirm) {
          handleReset(values);
        }
      });
    }
  };

  const isRecord = useMemo(() => {
    return (
      data?.status?.id === BERTH_STATUS.BERTHING ||
      data?.status?.id === BERTH_STATUS.DEPARTING
    );
  }, [data?.status?.id]);

  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    touched,
    setValues,
    setFieldTouched,
    setTouched,
  } = useFormik({
    initialValues: {
      currentStatus: berthStatus?.[data?.status?.id]?.code,
      upcomingStatus: "",

      leftSensorDistance: data?.distanceToLeft,
      rightSensorDistance: data?.distanceToRight,

      vesselIMO: "",
      vesselName: "",
      vesselFlag: "",
      vesselLength: "",
      vesselBeam: "",
      vesselType: "",
      vesselDirection: false,
      vesselBuilder: "",
      vesselBuilt: "",
      vesselOwner: "",
      vesselManager: "",
      vesselMaxDraught: "",
      vesselClass: "",
      vesselNT: "",
      vesselGT: "",
      vesselTEU: "",
      vesselDWT: "",
      vesselGas: "",
      vesselCRUDE: "",
      vesselLongitude: "",
      vesselLatitude: "",
      vesselHeading: "",
      vesselSpeed: "",
      vesselCallSign: "",
    },
    onSubmit: handleConfirm,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      currentStatus: Yup.string(),
      upcomingStatus: isRecord
        ? Yup.string()
        : Yup.string().required(t("note.required-message")),
      leftSensorDistance: Yup.number(t("note.invalid-number"))
        .min(0, t("note.range", { min: 0, max: 50 }))
        .max(50, t("note.range", { min: 0, max: 50 }))
        .required(t("note.required-message")),
      rightSensorDistance: Yup.number(t("note.invalid-number"))
        .min(0, t("note.range", { min: 0, max: 50 }))
        .max(50, t("note.range", { min: 0, max: 50 }))
        .required(t("note.required-message")),

      vesselIMO: Yup.string().required(t("note.required-message")),
      vesselName: Yup.string().required(t("note.required-message")),
      vesselFlag: Yup.string().required(t("note.required-message")),
      vesselLength: Yup.number(t("note.invalid-number"))
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 1000 }))
        .max(1000, t("note.range", { min: 0, max: 1000 })),
      vesselBeam: Yup.number(t("note.invalid-number"))
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 1000 }))
        .max(1000, t("note.range", { min: 0, max: 1000 })),
      vesselDirection: Yup.boolean(),
      vesselType: Yup.string(),
      vesselBuilder: Yup.string(),
      vesselBuilt: Yup.number(t("note.invalid-number")),
      vesselOwner: Yup.string(),
      vesselManager: Yup.string(),
      vesselMaxDraught: Yup.number(t("note.invalid-number")),
      vesselClass: Yup.string(),
      vesselNT: Yup.number(t("note.invalid-number")),
      vesselGT: Yup.number(t("note.invalid-number")),
      vesselTEU: Yup.number(t("note.invalid-number")),
      vesselDWT: Yup.number(t("note.invalid-number")),
      vesselGas: Yup.number(t("note.invalid-number")),
      vesselCRUDE: Yup.number(t("note.invalid-number")),
      vesselLongitude: Yup.number(t("note.invalid-number")),
      vesselLatitude: Yup.number(t("note.invalid-number")),
      vesselHeading: Yup.number(t("note.invalid-number")),
      vesselSpeed: Yup.number(t("note.invalid-number")),
      vesselCallSign: Yup.string(),
    }),
  });

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    setTimeout(() => {
      setValues({
        ...values,
        currentStatus: BERTH_STATUS_CODE?.[data?.status?.id],

        leftSensorDistance: data?.distanceToLeft,
        rightSensorDistance: data?.distanceToRight,

        vesselIMO: data?.currentVessel?.code,
        vesselDirection: data?.vesselDirection,
      });
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    // grey = data real time - user input
    // có socket trả về -> data socket - user input, case user input rỗng = -4
    // k có socket trả về -> always '-'
    if (socketData) {
      let currentDistanceLeft = "-";
      if (socketData?.left_sensor?.value) {
        if (values.leftSensorDistance) {
          currentDistanceLeft = (
            socketData?.left_sensor?.value - values.leftSensorDistance
          ).toFixed(3);
        } else {
          currentDistanceLeft = (socketData?.left_sensor?.value).toFixed(3);
        }
      }
      let currentDistanceRight = "-";
      if (socketData?.right_sensor?.value) {
        if (values.rightSensorDistance) {
          currentDistanceRight = (
            socketData?.right_sensor?.value - values.rightSensorDistance
          ).toFixed(3);
        } else {
          currentDistanceRight = (socketData?.right_sensor?.value).toFixed(
            3
          );
        }
      }
      setSensorSocketData({
        currentDistanceLeft,
        currentDistanceRight,
        leftSensorStatus:
          socketData?.left_sensor?.error || !socketData?.left_sensor?.value
            ? 2 // error code
            : socketData?.left_sensor?.status,
        leftSensorStatusText: socketData?.left_sensor?.error ?? "normal",
        rightSensorStatus:
          socketData?.right_sensor?.error || !socketData?.right_sensor?.value
            ? 2 // error code
            : socketData?.right_sensor?.status,
        rightSensorStatusText: socketData?.right_sensor?.error ?? "normal",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketData]);

  return (
    <Dialog
      open={open}
      onClose={() =>
        _handleClose({
          forcesBack: data?.status?.id === BERTH_STATUS.AVAILABLE,
        })
      }
      maxWidth="md"
      style={{ padding: "0px 0px 0px 0px" }}
    >
      <DialogContent
        style={{
          padding: 0,
        }}
      >
        {loading && (
          <div className={styles.loading}>
            <CircularProgress color="inherit" size={24} />
          </div>
        )}
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <div>
              <p className={styles.modalTitle}>
                {t("berthing:berthing_aid_setting")} - {data?.name}
              </p>
            </div>
            <IconButton
              className={styles.closeButton}
              onClick={() =>
                _handleClose({
                  forcesBack: data?.status?.id === BERTH_STATUS.AVAILABLE,
                })
              }
              disableRipple
            >
              <CloseIcon />
            </IconButton>
          </div>

          <p className={styles.sectionTitle}>
            {t("berthing:berth_status.berth_status")}
          </p>
          <BerthingStatus
            handleChange={handleChange}
            values={values}
            errors={errors}
            touched={touched}
            isRecord={isRecord}
          />

          <p className={styles.sectionTitle}>
            {t("berthing:berth_information.berth_information")}
          </p>
          <BerthingInformation
            sensorSocketData={sensorSocketData}
            values={values}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
            isRecord={isRecord}
          />

          <p className={styles.sectionTitle}>
            {t("berthing:vessel_information.vessel_information")}
          </p>
          <VesselInformation
            handleChange={handleChange}
            values={values}
            errors={errors}
            touched={touched}
            setValues={setValues}
            setFieldTouched={setFieldTouched}
            isRecord={isRecord}
          />
        </div>
      </DialogContent>

      <DialogActions className={styles.saveButton}>
        <ModalButtons onOk={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default memo(BerthingSettingDialog);
