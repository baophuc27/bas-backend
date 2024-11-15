import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ModalButtons } from "common/components";
import { BerthService } from "common/services";
import { notify } from "common/utils";
import { useFormik } from "formik";
import { t } from "i18next";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import styles from "./berth-setting-dialog.style.module.css";
import GeneralInformation from "./general-information.component";
import LayoutParameter from "./layout-parameter.component";

const BerthSettingDialog = ({
  open,
  handleClose,
  data,
  setData,
  refetchAlarmData,
}) => {
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (values) => {
    if (!id) return;
    setLoading(true);
    const result = await BerthService.update(id, {
      name: values.berthName,
      directionCompass: values.berthDirection,
      limitZone1: values.limitZone1,
      limitZone2: values.limitZone2,
      limitZone3: values.limitZone3,
      distanceToLeft: values.leftSensorDistance,
      distanceToRight: values.rightSensorDistance,
      distanceFender: values.leftSensorDistanceToEdge,
      distanceDevice: values.distantBetweenSensors,
    });
    setLoading(false);
    if (!result?.data?.success) {
      notify("error", t("berth:update_berth_failed"));
      return;
    }
    refetchAlarmData();
    notify("success", t("berth:update_berth_success"));
    setData((prev) => ({
      ...prev,
      ...result?.data?.data,
      leftDevice: {
        status: values.leftSensorStatus,
        ...data?.leftDevice,
      },
      rightDevice: {
        status: values.rightSensorStatus,
        ...data?.rightDevice,
      },
    }));
    handleClose();
  };

  const {
    handleChange,
    values,
    handleSubmit,
    errors,
    touched,
    setValues,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      berthName: data?.name,
      berthDirection: data?.directionCompass,
      limitZone1: data?.limitZone1,
      limitZone2: data?.limitZone2,
      limitZone3: data?.limitZone3,

      leftSensorStatus: data?.leftDevice?.status,
      rightSensorStatus: data?.rightDevice?.status,
      leftSensorDistance: data?.distanceToLeft,
      rightSensorDistance: data?.distanceToRight,

      leftSensorDistanceToEdge: data?.distanceFender, // TBD
      distantBetweenSensors: data?.distanceDevice,
    },
    onSubmit: handleUpdate,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      berthName: Yup.string().required(t("note.required-message")),
      berthDirection: Yup.number()
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 360 }))
        .max(360, t("note.range", { min: 0, max: 360 })),
      // limitZone1 < limitZone2 < limitZone3 <= 300
      limitZone1: Yup.number()
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 300 }))
        .max(300, t("note.range", { min: 0, max: 300 }))
        .test("validate", function (value) {
          const { limitZone2 } = this.parent;
          if (value >= limitZone2) {
            return this.createError({
              message: t("alarm:value_less", { number: limitZone2 }),
            });
          }
          return true;
        }),
      limitZone2: Yup.number()
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 300 }))
        .max(300, t("note.range", { min: 0, max: 300 }))
        .test("validate", function (value) {
          const { limitZone1, limitZone3 } = this.parent;
          if (value <= limitZone1 || value >= limitZone3) {
            return this.createError({
              message: t("common:note.range", {
                min: limitZone1,
                max: limitZone3,
              }),
            });
          }
          return true;
        }),
      limitZone3: Yup.number()
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 300 }))
        .max(300, t("note.range", { min: 0, max: 300 }))
        .test("validate", function (value) {
          const { limitZone2 } = this.parent;
          if (value <= limitZone2) {
            return this.createError({
              message: t("alarm:value_greater", { number: limitZone2 }),
            });
          }
          return true;
        }),
      leftSensorDistance: Yup.number()
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 50 }))
        .max(50, t("note.range", { min: 0, max: 50 })),
      rightSensorDistance: Yup.number()
        .required(t("note.required-message"))
        .min(0, t("note.range", { min: 0, max: 50 }))
        .max(50, t("note.range", { min: 0, max: 50 })),
      leftSensorDistanceToEdge: Yup.number().required(
        t("note.required-message")
      ),
      distantBetweenSensors: Yup.number().required(t("note.required-message")),
    }),
  });

  useEffect(() => {
    if (!open || !data) return;
    setValues({
      ...values,
      berthName: data?.name,
      berthDirection: data?.directionCompass,
      limitZone1: data?.limitZone1,
      limitZone2: data?.limitZone2,
      limitZone3: data?.limitZone3,

      leftSensorStatus: data?.leftDevice?.status,
      rightSensorStatus: data?.rightDevice?.status,
      leftSensorDistance: data?.distanceToLeft,
      rightSensorDistance: data?.distanceToRight,

      leftSensorDistanceToEdge: data?.distanceFender,
      distantBetweenSensors: data?.distanceDevice ?? 80,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, open]);

  return (
    <Dialog
      // fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
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
                {t("berth:berth_setting")} - {data?.name}
              </p>
            </div>
            <IconButton
              className={styles.closeButton}
              onClick={handleClose}
              disableRipple
            >
              <CloseIcon />
            </IconButton>
          </div>

          <p className={styles.sectionTitle}>
            {t("berth:general_information.general_information")}
          </p>
          <GeneralInformation
            handleChange={handleChange}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
          />

          <p className={styles.sectionTitle}>
            {t("berth:parameter_berth_layout.parameter_berth_layout")}
          </p>
          <LayoutParameter
            handleChange={handleChange}
            values={values}
            errors={errors}
            touched={touched}
            setFieldTouched={setFieldTouched}
          />
        </div>
      </DialogContent>

      <DialogActions className={styles.saveButton}>
        <ModalButtons onOk={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default memo(BerthSettingDialog);
