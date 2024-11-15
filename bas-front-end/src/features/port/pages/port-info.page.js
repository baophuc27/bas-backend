import {
  DesktopView,
  FormButtons,
  FormGroup,
  MenuAppBar,
  MobileView,
  PagePermissionCheck,
} from "common/components";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
import { usePageConfig, usePermission } from "common/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePortInfo } from "../hooks";
import classes from "./port-info.style.module.css";

export const PortInfoPage = (props) => {
  const { t } = useTranslation();
  const pageData = usePortInfo(t);
  const { fieldList, formik, fetchData, isLoading, handleResetForm } = pageData;
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();
  const { hasPermission } = usePermission();

  useEffect(() => {
    setPageTitle({
      id: "port-info:page-title.update",
    });
    setBreadcrumbsList({
      id: "port-info:update",
    });

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PagePermissionCheck
        feature={FEATURES.PORT_INFORMATION}
        redirectTo="/dashboard"
      >
        <DesktopView>
          <div className="main-content">
            <h1 className="main-title">{t("port-info:page-title.update")}</h1>

            <form onSubmit={formik?.handleSubmit}>
              <FormGroup
                items={fieldList}
                formik={formik}
                loading={isLoading}
                disabled={
                  !hasPermission(FEATURES.PORT_INFORMATION, ACTIONS.EDIT)
                }
              />

              {hasPermission(FEATURES.PORT_INFORMATION, ACTIONS.EDIT) && (
                <FormButtons
                  formik={pageData?.formik}
                  loading={pageData?.loading}
                  handleResetForm={handleResetForm}
                  showsCancel={false}
                />
              )}
            </form>
          </div>
        </DesktopView>

        <MobileView
          AppBar={<MenuAppBar title={t("port-info:page-title.update")} />}
        >
          <div className={classes.mobileContainer}>
            <form onSubmit={formik?.handleSubmit}>
              <FormGroup
                items={fieldList}
                formik={formik}
                loading={isLoading}
                disabled={
                  !hasPermission(FEATURES.PORT_INFORMATION, ACTIONS.EDIT)
                }
              />

              {hasPermission(FEATURES.PORT_INFORMATION, ACTIONS.EDIT) && (
                <FormButtons
                  formik={pageData?.formik}
                  loading={pageData?.loading}
                  handleResetForm={handleResetForm}
                />
              )}
            </form>
          </div>
        </MobileView>
      </PagePermissionCheck>
    </>
  );
};
