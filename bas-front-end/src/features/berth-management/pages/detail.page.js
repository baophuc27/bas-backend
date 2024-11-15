import { Button, CircularProgress } from "@material-ui/core";
import {
  DesktopOnly,
  DesktopView,
  MenuAppBar,
  MobileView,
  PagePermissionCheck,
} from "common/components";
import { FEATURES } from "common/constants/feature.constant";
import { usePageConfig } from "common/hooks";
import { BerthService } from "common/services";
import { notify } from "common/utils";
import GeneralInformation from "features/dock/components/berth-setting-dialog/general-information.component";
import LayoutParameter from "features/dock/components/berth-setting-dialog/layout-parameter.component";
import { useFormik } from "formik";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import detailStyles from "./../styles/detail.style.module.css";
import styles from "./../styles/list.style.module.css";

const BerthManagementAddPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();

  const [loading, setLoading] = useState(true);
  const [berthInfo, setBerthInfo] = useState(null);

  const handleUpdate = async (values) => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await BerthService.update(id, {
        name: values.berthName,
        ...(i18next.language.includes("en") && { nameEn: values.berthName }),
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
      console.info("result", result);

      if (!result?.data?.success) {
        notify("error", t("berth:update_berth_failed"));
        return;
      }
      notify("success", t("berth:update_berth_success"));
      navigate(-1);
    } catch (error) {
      setLoading(false);
      notify("error", t("berth:update_berth_failed"));
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const result = await BerthService.create({
        // name, nameEn, directionCompass, limitZone1, limitZone2, limitZone3, distanceToLeft, distanceToRight, distanceFender, distanceDevice
        name: values.berthName,
        nameEn: values.berthName,
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
      if (!result?.data?.data) {
        notify("error", t("berth:create_berth_failed"));
        return;
      }
      notify("success", t("berth:create_berth_success"));
      navigate(-1);
    } catch (error) {
      setLoading(false);
      notify("error", t("berth:create_berth_failed"));
    }
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
      berthName: "",
      berthDirection: "",
      limitZone1: 60,
      limitZone2: 120,
      limitZone3: 200,

      leftSensorStatus: "",
      rightSensorStatus: "",
      leftSensorDistance: "",
      rightSensorDistance: "",

      leftSensorDistanceToEdge: "", // TBD
      distantBetweenSensors: "",
    },
    onSubmit: id ? handleUpdate : handleCreate,
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
    const fetchDetail = async () => {
      setLoading(true);
      BerthService.getDetail(id).then((res) => {
        if (res?.data?.success === false) {
          notify("error", t("berth:record_not_found"));
          navigate("/dashboard/berth-management");
          return;
        }
        const data = res?.data?.data;
        setValues({
          ...values,
          berthName: i18next.language.includes("en")
            ? data?.nameEn
            : data?.name,
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
        setBerthInfo(data);
        setLoading(false);
      });
    };

    if (id) {
      fetchDetail();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  useEffect(() => {
    setPageTitle({
      id: "berth:page-title.list",
    });
    setBreadcrumbsList({
      id: "berth:list",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PagePermissionCheck feature={FEATURES.BERTH_MANAGEMENT}>
      <DesktopView>
        <div className="main-content record-management-container">
          {loading && (
            <div className={detailStyles.loading}>
              <CircularProgress />
            </div>
          )}
          {!id ? (
            <p className={styles.title}>{t("berth:create_new")}</p>
          ) : (
            <p className={styles.title}>
              {t("berth:update")}{" "}
              {i18next.language.includes("en")
                ? berthInfo?.nameEn
                : berthInfo?.name}
            </p>
          )}
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

          <div className={styles.buttonGroup}>
            <Button className="custom-button" onClick={handleSubmit}>
              {t("common:button:save")}
            </Button>
            <Button
              className="light-button custom-button"
              onClick={() => navigate(-1)}
            >
              {t("common:button:cancel")}
            </Button>
          </div>
        </div>
      </DesktopView>

      <MobileView AppBar={<MenuAppBar title={t("berth:detail_title")} />}>
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default BerthManagementAddPage;
