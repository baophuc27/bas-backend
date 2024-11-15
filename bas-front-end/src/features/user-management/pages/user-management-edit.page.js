import {
  DesktopOnly,
  DesktopView,
  FormButtons,
  FormGroup,
  MenuAppBar,
  MobileView,
  PagePermissionCheck,
} from "common/components";
import { FEATURES } from "common/constants/feature.constant";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUserEdit } from "../hooks";

const UserManagementEditPage = (props) => {
  const { t } = useTranslation();
  const {
    fieldList,
    formik,
    loading,
    backUrl,
    pageLoading,
    fetchData,
    fetchAllRoles,
  } = useUserEdit();

  useEffect(() => {
    fetchAllRoles();
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <PagePermissionCheck feature={FEATURES.USER_MANAGEMENT}>
      <DesktopView>
        <div className="main-content">
          <h1 className="main-title">{t("user-management:edit-title")}</h1>

          <FormGroup items={fieldList} formik={formik} loading={pageLoading} />
          <FormButtons formik={formik} loading={loading} cancelLink={backUrl} />
        </div>
      </DesktopView>

      <MobileView
        AppBar={<MenuAppBar title={t("user-management:edit-title")} />}
      >
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default UserManagementEditPage;
