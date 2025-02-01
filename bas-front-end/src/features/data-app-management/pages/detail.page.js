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
import { BerthService, DataAppService } from "common/services";
import { notify } from "common/utils";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import detailStyles from "./../styles/detail.style.module.css";
import styles from "./../styles/list.style.module.css";

const DataAppDetailPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const code = params.id;
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();

  const [loading, setLoading] = useState(true);
  const [dataAppInfo, setDataAppInfo] = useState(null);
  const [berths, setBerths] = useState([]);

  const handleUpdate = async (values) => {
    if (!code) return;
    setLoading(true);
    try {
        
      const result = await DataAppService.update(code, {
        displayName: values.displayName,
        berthId: values.berthId === "" ? null : values.berthId,
        status: values.status,
      });
      setLoading(false);

      if (!result?.data?.success) {
        notify("error", t("data-app:update_failed"));
        return;
      }
      notify("success", t("data-app:update_success"));
      navigate("/dashboard/data-app-management");
    } catch (error) {
      setLoading(false);
      notify("error", t("data-app:update_failed"));
    }
  };

  const handleCreate = async (values) => {
    if (!values.code) {
      notify("error", t("data-app:code_required"));
      return;
    }
    
    try {
      setLoading(true);
      const result = await DataAppService.create({
        code: values.code,
        displayName: values.displayName,
        berthId: values.berthId === "" ? null : values.berthId,
        status: 'INACTIVE'
      });
      setLoading(false);
      
      if (!result?.data?.success) {
        notify("error", t("data-app:create_failed"));
        return;
      }
      notify("success", t("data-app:create_success"));
      navigate("/dashboard/data-app-management");
    } catch (error) {
      setLoading(false);
      notify("error", t("data-app:create_failed"));
    }
  };

  const handleGenerateCode = async () => {
    try {
      const res = await DataAppService.getAvailableCode();
      if (res?.data?.success) {
        const newCode = res.data.data.code || res.data.data;
        handleChange({
          target: {
            name: 'code',
            value: newCode
          }
        });
      } else {
        notify("error", t("data-app:generate_code_failed"));
      }
    } catch (error) {
      console.error("Failed to fetch available code:", error);
      notify("error", t("data-app:generate_code_failed"));
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
      code: "",
      displayName: "",
      berthId: "",
      status: "INACTIVE",
      lastHeartbeat: null,
      lastDataActive: null,
    },
    onSubmit: code ? handleUpdate : handleCreate,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      code: Yup.string().required(t("note.required-message")),
      displayName: Yup.string().required(t("note.required-message"))
    }),
  });

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await DataAppService.getOne(code);
        if (!res?.data?.success) {
          notify("error", t("data-app:record_not_found"));
          navigate("/dashboard/data-app-management");
          return;
        }
        const data = res.data.data;
        setValues({
          code: data.code,
          displayName: data.displayName,
          berthId: data.berthId,
          status: data.status,
          lastHeartbeat: data.lastHeartbeat,
          lastDataActive: data.lastDataActive,
        });
        setDataAppInfo(data);
      } catch (error) {
        notify("error", t("data-app:fetch_failed"));
        navigate("/dashboard/data-app-management");
      } finally {
        setLoading(false);
      }
    };

    const fetchBerths = async () => {
      try {
        const res = await BerthService.getAll();
        if (res?.data?.success) {
          setBerths(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch berths:", error);
      }
    };

    fetchBerths();
    if (code) {
      fetchDetail();
    } else {
      setLoading(false);
    }
  }, [code, navigate, setValues]);

  useEffect(() => {
    setPageTitle({
      id: "data-app:page-title:list",
    });
    setBreadcrumbsList({
      id: "data-app:list",
    });
  }, [setPageTitle, setBreadcrumbsList]);

  return (
    <PagePermissionCheck feature={FEATURES.BERTH_MANAGEMENT}>
      <DesktopView>
        <div className="main-content record-management-container">
          {loading && (
            <div className={detailStyles.loading}>
              <CircularProgress />
            </div>
          )}
          
          {!code ? (
            <p className={styles.title}>{t("data-app:create_new")}</p>
          ) : (
            <p className={styles.title}>
              {t("data-app:update")}{" "}
              {dataAppInfo?.displayName}
            </p>
          )}
          
          <p className={styles.sectionTitle}>
            {t("data-app:general_information.general_information")}
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={`${styles.label} ${styles.requiredLabel}`}>
                      {t("data-app:general_information.code")}
                    </label>
                    {code ? (
                      <input
                        type="text"
                        name="code"
                        value={values.code}
                        disabled={true}
                        className={`${styles.input} ${touched.code && errors.code ? styles.error : ''}`}
                      />
                    ) : (
                      <div className={styles.codeField}>
                        <input
                          type="text"
                          name="code"
                          value={values.code}
                          disabled={true}
                          className={`${styles.codeInput} ${touched.code && errors.code ? styles.error : ''}`}
                        />
                        <Button
                          variant="outlined"
                          onClick={handleGenerateCode}
                          style={{ height: 40 }}
                        >
                          {t("data-app:generate_new_code")}
                        </Button>
                      </div>
                    )}
                    {touched.code && errors.code && (
                      <div className={styles.errorMessage}>{errors.code}</div>
                    )}
                  </div>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={`${styles.label} ${styles.requiredLabel}`}>
                      {t("data-app:general_information.data_app_name")}
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={values.displayName}
                      onChange={handleChange}
                      onBlur={() => setFieldTouched('displayName', true)}
                      className={`${styles.input} ${touched.displayName && errors.displayName ? styles.error : ''}`}
                      placeholder={t("data-app:general_information.enter_name")}
                    />
                    {touched.displayName && errors.displayName && (
                      <div className={styles.errorMessage}>{errors.displayName}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={`${styles.label}`}>
                      {t("data-app:general_information.berth")}
                    </label>
                    <select
                      name="berthId"
                      value={values.berthId}
                      onChange={handleChange}
                      onBlur={() => setFieldTouched('berthId', true)}
                      className={`${styles.select} ${touched.berthId && errors.berthId ? styles.error : null}`}
                    >
                      <option value="">{t("data-app:empty")}</option>
                      {berths.map((berth) => (
                        <option key={berth.id} value={berth.id}>
                          {berth.name}
                        </option>
                      ))}
                    </select>
                    {touched.berthId && errors.berthId && (
                      <div className={styles.errorMessage}>{errors.berthId}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
          </form>
        </div>
      </DesktopView>

      <MobileView AppBar={<MenuAppBar title={t("data-app:detail_title")} />}>
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default DataAppDetailPage;