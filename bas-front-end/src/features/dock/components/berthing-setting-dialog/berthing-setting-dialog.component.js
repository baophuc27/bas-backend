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
import { BerthService, DataAppService } from "common/services";
import { notify } from "common/utils";
import { useFormik } from "formik";
import { t } from "i18next";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setBerthFormValues } from "redux/slices/berth.slice";
import swal from "sweetalert";
import * as Yup from "yup";
import BerthingInformation from "./berthing-information.component";
import styles from "./berthing-setting-dialog.style.module.css";
import BerthingStatus from "./berthing-status.component";
import DataAppInformation from "./data-app-information.component";
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
  const dispatch = useDispatch();
  const [dataAppList, setDataAppList] = useState([]);
  const [selectedDataApp, setSelectedDataApp] = useState(null);
  const [loadingDataApps, setLoadingDataApps] = useState(false);

  // This useEffect for fetching DataApp
  // Update useEffect to use getAll instead of getActive
  useEffect(() => {
    const fetchDataApps = async () => {
      try {
        const response = await DataAppService.getAll();
        if (response?.data?.success) {
          setDataAppList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data apps:", error);
        // notify("error", t("berthing:data_app.fetch_error"));
      }
    };

    fetchDataApps();
    // Remove dataAppList from dependencies, add only dependencies that should trigger a refetch
  }, [open]); // Only re-run when dialog opens

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
        vesselDirection: !!values.vesselDirection,
      });
      setLoading(false);
      if (!result?.data?.success) {
        notify("error", t("berthing:confirm.error"));
        return;
      }
      dispatch(setBerthFormValues(values));
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

  const handleDataAppChange = async (event) => {
    const selectedCode = event.target.value;

    setLoading(true);
    try {
      // If a data app was previously assigned to this berth, clear its assignment
      const previousAssignment = dataAppList.find((app) => app.berthId === id);
      if (previousAssignment) {
        await DataAppService.update(previousAssignment.code, {
          displayName: previousAssignment.displayName,
          berthId: null,
          status: previousAssignment.status,
        });
      }

      // If selecting a new data app, update its assignment
      if (selectedCode) {
        const selectedApp = dataAppList.find(
          (app) => app.code === selectedCode,
        );
        const result = await DataAppService.update(selectedCode, {
          displayName: selectedApp.displayName,
          berthId: id,
          status: selectedApp.status,
        });

        if (!result?.data?.success) {
          notify("error", t("data-app:berthing..update_failed"));
          return;
        }
      }

      // Refresh data app list
      const response = await DataAppService.getAll();
      if (response?.data?.success) {
        setDataAppList(response.data.data);
      }

      notify("success", t("data-app:berthing.update_success"));
    } catch (error) {
      console.error("Error updating data app:", error);
      // notify("error", t("berthing:data_app.update_failed"));
    } finally {
      setLoading(false);
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

  const handleFinishSession = async () => {
    if (!id) return false;
    setLoading(true);
    try {
      const result = await BerthService.finishSession(id);
      setLoading(false);
      if (!result?.data?.success) {
        notify("error", t("berthing:confirm.error"));
        return false;
      }
      return true;
    } catch (error) {
      setLoading(false);
      notify("error", t("berthing:confirm.error"));
      return false;
    }
  };

  const checkBerthStatus = async () => {
    try {
      const response = await BerthService.getAll();
      if (response?.data?.success) {
        const currentBerth = response?.data?.data?.find(
          (berth) => berth.id === Number(id),
        );

        if (!currentBerth) {
          notify("error", t("berthing:confirm.error"));
          return false;
        }

        const allowedTransitions = [
          [BERTH_STATUS.AVAILABLE, BERTH_STATUS.BERTHING],
          [BERTH_STATUS.AVAILABLE, BERTH_STATUS.DEPARTING],
          [BERTH_STATUS.BERTHING, BERTH_STATUS.AVAILABLE],
          [BERTH_STATUS.BERTHING, BERTH_STATUS.MOORING],
          [BERTH_STATUS.DEPARTING, BERTH_STATUS.AVAILABLE],
          [BERTH_STATUS.DEPARTING, BERTH_STATUS.MOORING],
          [BERTH_STATUS.MOORING, BERTH_STATUS.BERTHING],
          [BERTH_STATUS.MOORING, BERTH_STATUS.DEPARTING],
        ];

        const currentStatus = BERTH_STATUS[values.currentStatus];
        const upcomingStatus = BERTH_STATUS[values.upcomingStatus];

        const isValidTransition = allowedTransitions.some(
          ([from, to]) => from === currentStatus && to === upcomingStatus,
        );

        if (
          currentBerth?.status?.id !== BERTH_STATUS.AVAILABLE &&
          currentBerth?.status?.id !== BERTH_STATUS.MOORING &&
          !isValidTransition
        ) {
          // const confirm = await swal({
          //   title: t("home:dialogs.status-warning.title"),
          //   text: t("home:dialogs.status-warning.message"),
          //   icon: "warning",
          //   buttons: {
          //     cancel: t("common:cancel"),
          //     confirm: {
          //       text: t("common:continue"),
          //       value: true,
          //     },
          //   },
          // });
          // if (confirm) {
          //   window.location.reload();
          //   return false;
          // }
          return false;
        }
        return true;
      }
      notify("error", t("berthing:confirm.error"));
      return false;
    } catch (error) {
      notify("error", t("common:messages.error"));
      return false;
    }
  };

  const handleConfirm = async () => {
    const canProceed = await checkBerthStatus();
    if (!canProceed) {
      return;
    }

    setTouched({});

    const currentStatus = BERTH_STATUS[values.currentStatus];
    const upcomingStatus = BERTH_STATUS[values.upcomingStatus];

    // Any status changing to AVAILABLE needs reset confirmation
    if (upcomingStatus === BERTH_STATUS.AVAILABLE) {
      swal({
        title: t("berthing:confirm.confirm"),
        text: t("berthing:confirm.reset_confirm"),
        icon: "warning",
        buttons: [t("common:button.cancel"), t("common:button.ok")],
        dangerMode: true,
      }).then((willConfirm) => {
        if (willConfirm) {
          handleReset(values);
        }
      });
      return;
    }

    // Handle special cases that need finish session
    if (
      (currentStatus === BERTH_STATUS.BERTHING &&
        upcomingStatus === BERTH_STATUS.MOORING) ||
      (currentStatus === BERTH_STATUS.MOORING &&
        upcomingStatus === BERTH_STATUS.DEPARTING)
    ) {
      try {
        const finishSuccess = await handleFinishSession();
        if (!finishSuccess) return;

        const updateSuccess = await handleUpdate({
          ...values,
          currentStatus:
            upcomingStatus === BERTH_STATUS.MOORING ? "MOORING" : "DEPARTING",
          upcomingStatus: "",
        });

        if (updateSuccess) {
          notify(
            "success",
            upcomingStatus === BERTH_STATUS.MOORING
              ? t("berthing:confirm.vessel_is_mooring.")
              : t("berthing:confirm.vessel_is_departing."),
          );
        }
      } catch (error) {
        notify("error", t("berthing:confirm.error"));
      }
      return;
    }

    // Handle normal update
    const res = await handleUpdate(values);
    if (res) {
      let message;
      switch (upcomingStatus) {
        case BERTH_STATUS.BERTHING:
          message = t("berthing:confirm.vessel_is_berthing.");
          break;
        case BERTH_STATUS.DEPARTING:
          message = t("berthing:confirm.vessel_is_departing.");
          break;
        case BERTH_STATUS.MOORING:
          message = t("berthing:confirm.vessel_is_mooring.");
          break;
        default:
          message = t("berthing:confirm.update_success");
      }
      notify("success", message);
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
    // if (socketData) {
    let currentDistanceLeft = "-";
    let leftSensorStatus = 2; // default to disconnected
    let leftSensorStatusText = "disconnected";

    if (socketData?.left_sensor?.status !== undefined) {
      if (socketData?.left_sensor?.value !== null) {
        if (values.leftSensorDistance) {
          currentDistanceLeft = (
            socketData?.left_sensor?.value - values.leftSensorDistance
          ).toFixed(3);
        } else {
          currentDistanceLeft = (socketData?.left_sensor?.value).toFixed(3);
        }
        leftSensorStatus = socketData?.left_sensor?.error
          ? 2
          : socketData?.left_sensor?.status;
        leftSensorStatusText = socketData?.left_sensor?.error ?? "normal";
      } else {
        currentDistanceLeft = "-";
        leftSensorStatus = 2;
        leftSensorStatusText = "lost_target";
      }
    }

    let currentDistanceRight = "-";
    let rightSensorStatus = 2; // default to disconnected
    let rightSensorStatusText = "disconnected";

    if (socketData?.right_sensor?.status !== undefined) {
      if (socketData?.right_sensor?.value !== null) {
        if (values.rightSensorDistance) {
          currentDistanceRight = (
            socketData?.right_sensor?.value - values.rightSensorDistance
          ).toFixed(3);
        } else {
          currentDistanceRight = (socketData?.right_sensor?.value).toFixed(3);
        }
        rightSensorStatus = socketData?.right_sensor?.error
          ? 2
          : socketData?.right_sensor?.status;
        rightSensorStatusText = socketData?.right_sensor?.error ?? "normal";
      } else {
        currentDistanceRight = "-";
        rightSensorStatus = 2;
        rightSensorStatusText = "lost_target";
      }
    }

    setSensorSocketData({
      currentDistanceLeft,
      currentDistanceRight,
      leftSensorStatus,
      leftSensorStatusText,
      rightSensorStatus,
      rightSensorStatusText,
    });
    // }
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
            {t("berthing:berth_information:data_app_information")}
          </p>
          <DataAppInformation
            dataAppList={dataAppList}
            handleChange={handleDataAppChange}
            loading={loading}
            isRecord={isRecord}
            currentBerthId={id} // Pass current berth ID
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
