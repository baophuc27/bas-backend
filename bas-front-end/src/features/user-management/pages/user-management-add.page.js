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
import { useUserCreate } from "../hooks";

const UserManagementAddPage = (props) => {
  const { t } = useTranslation();
  const {
    fieldList,
    formik,
    loading,
    fetchAllAvailableAccounts,
    fetchAllRoles,
  } = useUserCreate();

  useEffect(() => {
    fetchAllAvailableAccounts();
    fetchAllRoles();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PagePermissionCheck feature={FEATURES.USER_MANAGEMENT}>
      <DesktopView>
        <div className="main-content">
          <h1 className="main-title">{t("user-management:add-title")}</h1>

          <FormGroup items={fieldList} formik={formik} />
          <FormButtons
            formik={formik}
            loading={loading}
            cancelLink="/dashboard/users"
            isValid={formik.dirty && formik.isValid}
          />
        </div>
      </DesktopView>

      <MobileView
        AppBar={<MenuAppBar title={t("user-management:add-title")} />}
      >
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default UserManagementAddPage;
