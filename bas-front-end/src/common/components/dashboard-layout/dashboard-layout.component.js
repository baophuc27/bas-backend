import { AuthCheck, DesktopView, MobileView } from "common/components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AppLayout, LeftMenu, PageBreadcrumbs, PageHeader } from "../index";
import classes from "./dashboard-layout.style.module.css";

export const DashboardLayout = (props) => {
  const { t, i18n } = useTranslation();
  const { titleId, titleParams } = useSelector((state) => state?.pageConfig);

  useEffect(() => {
    document.title = `${t("common:app.name")} | ${t(titleId, titleParams)}`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.language, titleId, titleParams]);

  return (
    <AuthCheck>
      <MobileView>
        <Outlet />

        {/* <ToastContainer
          containerId="standard-toast"
          position="top-center"
          enableMultiContainer
        /> */}
      </MobileView>

      <DesktopView>
        <AppLayout>
          <div className={classes.container}>
            <LeftMenu />

            <main className={classes.main}>
              <PageHeader logoRedirectUrl="/dashboard" />
              <PageBreadcrumbs />

              <div className={classes.content}>
                <Outlet />
              </div>
            </main>

            {/* <ToastContainer
              containerId="standard-toast"
              position="bottom-right"
              enableMultiContainer
            /> */}
          </div>
        </AppLayout>
      </DesktopView>
    </AuthCheck>
  );
};
