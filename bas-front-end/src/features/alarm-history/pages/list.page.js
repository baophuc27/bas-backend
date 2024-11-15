import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
import {
  DesktopOnly,
  DesktopView,
  MenuAppBar,
  MobileView,
  PagePermissionCheck,
  SharedInputField,
  SharedSelectField,
  SharedTable,
} from "common/components";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
import { usePageConfig, usePermission } from "common/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ListPageContent } from "../content";
import { useList } from "../hooks";
import styles from "./../styles/list.style.module.css";

const AlarmHistoryListPage = (props) => {
  const { t, i18n } = useTranslation();
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();
  const pageHook = useList(i18n.language);
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
    onDeleteAll,
    onSubmit,
    fetchData,
    setKeyword,
    onSortModelChange,

    valueType,
    setValueType,
    valueAlarm,
    setValueAlarm,
    valueBerth,
    setValueBerth,

    searchType,
    searchBerth,
    searchAlarm,

    onExportData,
    exportLoading,
  } = pageHook;

  const berths = useSelector((state) => state?.enumeration?.berths);

  useEffect(() => {
    setPageTitle(t("alarm:title"));
    setPageTitle({
      id: "alarm:page-title.list",
    });
    setBreadcrumbsList({
      id: "alarm:list",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    pageSize,
    searchKeyword,
    sortModel,
    searchType,
    searchBerth,
    searchAlarm,
  ]);

  return (
    <PagePermissionCheck feature={FEATURES.ALARM_MANAGEMENT}>
      <DesktopView>
        <div className="main-content record-management-container">
          <h1 className="main-title">{t("alarm:title")}</h1>
          <Grid container spacing={2}>
            <Grid item xs={3}>
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
            </Grid>
            <Grid item xs={3}>
              <SharedSelectField
                className="text-normal"
                label={t("record-management:berth")}
                disableClearable
                name="spm"
                options={[
                  {
                    value: "",
                    label: t("common:input.all-items"),
                  },
                  ...berths?.map((berth) => {
                    return {
                      value: berth?.id,
                      label: i18n.language.includes("en")
                        ? berth?.nameEn
                        : berth?.name,
                    };
                  }),
                ]}
                defaultValue={valueBerth}
                onChange={(_, value) => {
                  setValueBerth(value);
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <SharedSelectField
                className="text-normal"
                label={t("alarm:type")}
                disableClearable
                name="spm"
                options={[
                  {
                    value: "",
                    label: t("common:input.all-items"),
                  },
                  ...["distance", "speed", "angle"].map((item) => {
                    return {
                      value: item,
                      label: t(`alarm:${item}`),
                    };
                  }),
                ]}
                defaultValue={valueType}
                onChange={(_, value) => {
                  setValueType(value);
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <SharedSelectField
                className="text-normal"
                label={t("alarm:alarm_value")}
                disableClearable
                name="spm"
                options={[
                  {
                    value: "",
                    label: t("common:input.all-items"),
                  },
                  ...["warning", "emergency"].map((item) => {
                    return {
                      value: item === "warning" ? 2 : 3,
                      label: t(`alarm:${item}`),
                    };
                  }),
                ]}
                defaultValue={valueAlarm}
                onChange={(_, value) => {
                  setValueAlarm(value);
                }}
              />
            </Grid>
          </Grid>

          <Box
            mt={3}
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" ml="auto">
              <Box mr={2}>
                <Button
                  className="custom-button light-button"
                  type="button"
                  onClick={onReset}
                  disabled={loading}
                >
                  {t("common:button.clear")}
                </Button>
              </Box>

              <Button
                className="custom-button"
                onClick={onSubmit}
                disabled={
                  loading ||
                  (!keyword && !valueBerth && !valueType && !valueAlarm)
                }
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
              delete: onDelete,
            }}
            disabledControls={{
              delete: () =>
                !hasPermission(FEATURES.ALARM_MANAGEMENT, ACTIONS.DELETE),
            }}
          />
          <div className={styles.buttonGroup}>
            <Button
              className="custom-button"
              disabled={loading || !data?.data?.length}
              onClick={onDeleteAll}
            >
              {t("common:button:delete_all")}
            </Button>
            <Button
              className="custom-button success-button"
              onClick={onExportData}
              disabled={exportLoading || !data?.data?.length}
            >
              <Box display="flex" alignItems="center">
                {exportLoading && (
                  <CircularProgress
                    size={14}
                    color="#FFF"
                    style={{ marginRight: 12 }}
                  />
                )}
                <p>{t("record-management:export")}</p>
              </Box>
            </Button>
          </div>
        </div>
      </DesktopView>

      <MobileView AppBar={<MenuAppBar title={t("alarm:title")} />}>
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default AlarmHistoryListPage;
