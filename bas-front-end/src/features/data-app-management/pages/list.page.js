import { Box, Button } from "@material-ui/core";
import {
    DesktopOnly,
    DesktopView,
    MenuAppBar,
    MobileView,
    PagePermissionCheck,
    SharedInputField,
    SharedTable,
} from "common/components";
import { DATA_APP_STATUS } from "common/constants/data-app.constant";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
import { usePageConfig, usePermission } from "common/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ListPageContent } from "../content";
import { useDataAppList } from "../hooks";

const DataAppManagementListPage = (props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();
  const dataApps = useSelector((state) => state?.enumeration?.dataApps);
  console.log(dataApps)
  const pageHook = useDataAppList(i18n.language);
  const { hasPermission } = usePermission();
  const {
    data,
    page,
    pageSize,
    loading,
    keyword,
    searchKeyword,
    sortModel,
    onReset,
    onPageChange,
    onPageSizeChange,
    onDelete,
    onSubmit,
    onEdit,
    fetchData,
    setKeyword,
    onSortModelChange,
  } = pageHook;

  useEffect(() => {
    setPageTitle(t("data-app:page-title.list"));
    setPageTitle({
      id: "data-app:page-title.list",
    });
    setBreadcrumbsList({
      id: "data-app:page-title.list",
      
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchKeyword, sortModel]);

  return (
    <PagePermissionCheck feature={FEATURES.BERTH_MANAGEMENT}>
      <DesktopView>
        <div className="main-content data-app-management-container">
          <h1 className="main-title">{t("data-app:page-title.list")}</h1>
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

          <Box
            mt={3}
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              className="custom-button light-button"
              type="button"
              onClick={() => navigate("add")}
            >
              {t("common:button.add")}
            </Button>
            <Box display="flex" ml="auto">
              <Box mr={2}>
                <Button
                  className="custom-button light-button"
                  type="button"
                  onClick={onReset}
                  disabled={loading || !keyword}
                >
                  {t("common:button.clear")}
                </Button>
              </Box>

              <Button
                className="custom-button"
                onClick={onSubmit}
                disabled={loading || !keyword}
              >
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
            }}
            disabledControls={{
              delete: (row) =>
                !hasPermission(FEATURES.BERTH_MANAGEMENT, ACTIONS.DELETE) ||
                row?.status === DATA_APP_STATUS.ACTIVE,
            }}
          />
        </div>
      </DesktopView>

      <MobileView AppBar={<MenuAppBar title={t("data-app:title")} />}>
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default DataAppManagementListPage;