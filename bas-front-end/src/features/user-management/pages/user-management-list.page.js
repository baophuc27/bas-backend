import { Box, Button } from "@material-ui/core";
import {
  DesktopOnly,
  DesktopView,
  MenuAppBar,
  MobileView,
  PagePermissionCheck,
  ResetPasswordModal,
  SharedInputField,
  SharedSelectField,
  SharedTable,
} from "common/components";
import { usePageConfig } from "common/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
import { FEATURES } from "common/constants/feature.constant";
import { ListPageContent } from "../content";
import { useUserList } from "../hooks";

const UserManagementListPage = (props) => {
  const { t, i18n } = useTranslation();
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();
  const pageHook = useUserList(i18n.language);
  const {
    data,
    page,
    pageSize,
    keyword,
    searchKeyword,
    valueRole,
    searchRole,
    roles,
    loading,
    sortModel,
    auth,
    resetPasswordModalVisible,
    resettingPassword,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
    onSubmit,
    fetchData,
    setKeyword,
    setValueRole,
    onReset,
    onSortModelChange,
    onResetPassword,
    toggleResetPasswordModal,
    onSavePassword,
  } = pageHook;

  useEffect(() => {
    setPageTitle(t("user-management:title"));
    setPageTitle({
      id: "user-management:page-title.list",
    });
    setBreadcrumbsList({
      id: "user-management:list",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchKeyword, sortModel, searchRole]);

  return (
    <PagePermissionCheck feature={FEATURES.USER_MANAGEMENT}>
      <DesktopView>
        <div className="main-content">
          <h1 className="main-title">{t("user-management:title")}</h1>

          <Box display="flex" justifyContent="space-between">
            <Box mb={3} width="70%">
              <SharedInputField
                name="search"
                label={t("common:input.keyword")}
                type="text"
                placeholder={t("common:input.keyword-hint")}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
                disabled={false}
                value={keyword}
              />
            </Box>
            <Box mb={3} width="29%">
              <SharedSelectField
                className="text-normal"
                // label={t("user-management:permission")}
                label={"Role"}
                disableClearable
                name="spm"
                options={[
                  {
                    value: "",
                    label: t("common:input.all-items"),
                  },
                ].concat(
                  roles.map((item) => ({
                    id: item.id,
                    value: item.id,
                    label: ["en", "en-US"].includes(i18n.language)
                      ? item.nameEn
                      : item.nameVi,
                  })),
                )}
                defaultValue={valueRole}
                onChange={(_, value) => {
                  setValueRole(value);
                }}
              />
            </Box>
          </Box>

          <Box
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              {/* <Link to={"/dashboard/users/add"}>
                <Button className="custom-button light-button" type="button">
                  {t("user-management:button.add")}
                </Button>
              </Link> */}
            </Box>

            <Box display="flex" ml="auto">
              <Box mr={2}>
                <Button
                  className="custom-button light-button"
                  type="button"
                  onClick={onReset}
                >
                  {t("common:button.clear")}
                </Button>
              </Box>

              <Button className="custom-button" onClick={onSubmit}>
                {t("common:button.apply")}
              </Button>
            </Box>
          </Box>

          <SharedTable
            loading={loading}
            count={data?.total}
            data={data?.data}
            page={page}
            pageSize={pageSize}
            sortModel={sortModel}
            content={ListPageContent(t, i18n.language)}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onSortModelChange={onSortModelChange}
            actionHandlers={{
              edit: onEdit,
              delete: onDelete,
              resetPass: onResetPassword,
            }}
            disabledControls={{
              delete: (row) => row.id === auth?.auth?.id,
              resetPass: (row) => row.useManualAccount === false,
            }}
          />
        </div>
      </DesktopView>

      <MobileView AppBar={<MenuAppBar title={t("user-management:title")} />}>
        <DesktopOnly />
      </MobileView>
      <ResetPasswordModal
        visible={resetPasswordModalVisible}
        fieldList={pageHook?.fieldList}
        title={t("user-management:reset-password")}
        onClose={toggleResetPasswordModal}
        onOk={onSavePassword}
        formik={pageHook?.formik}
        loading={resettingPassword}
        subTitle={`${t("user-management:account")}: ${
          pageHook?.formik?.values?.userAccount
        }`}
      />
    </PagePermissionCheck>
  );
};

export default UserManagementListPage;
