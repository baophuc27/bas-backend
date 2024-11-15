import {
  DesktopView,
  FormGroup,
  MenuAppBar,
  MobileView,
} from "common/components";
import { usePageConfig } from "common/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccountInfo } from "../hooks";
import classes from "./account-info.style.module.css";

export const AccountInfoPage = (props) => {
  const { t } = useTranslation();
  const pageData = useAccountInfo(t);
  const { fieldList, formik, fetchData, isLoading, handleResetForm } = pageData;
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();

  useEffect(() => {
    setPageTitle({
      id: "account-info:page-title.update",
    });
    setBreadcrumbsList({
      id: "account-info:update",
    });

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DesktopView>
        <div className="main-content">
          <h1 className="main-title">{t("account-info:page-title.update")}</h1>

          <form onSubmit={formik?.handleSubmit}>
            <FormGroup items={fieldList} formik={formik} loading={isLoading} />

            {/* <FormButtons
              formik={pageData?.formik}
              loading={pageData?.loading}
              handleResetForm={handleResetForm}
              showsCancel={false}
            /> */}
          </form>
        </div>
      </DesktopView>

      <MobileView
        AppBar={<MenuAppBar title={t("account-info:page-title.update")} />}
      >
        <div className={classes.mobileContainer}>
          <form onSubmit={formik?.handleSubmit}>
            <FormGroup items={fieldList} formik={formik} loading={isLoading} />

            {/* <FormButtons
              formik={pageData?.formik}
              loading={pageData?.loading}
              handleResetForm={handleResetForm}
            /> */}
          </form>
        </div>
      </MobileView>
    </>
  );
};
