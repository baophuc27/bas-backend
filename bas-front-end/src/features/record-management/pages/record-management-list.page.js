import { Box, Button, Grid } from "@material-ui/core";
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
import { useRecordList } from "../hooks";

const RecordManagementListPage = (props) => {
  const { t, i18n } = useTranslation();
  const { setPageTitle, setBreadcrumbsList } = usePageConfig();
  const berths = useSelector((state) => state?.enumeration?.berths);
  const { hasPermission } = usePermission();
  const pageHook = useRecordList(i18n.language);
  const {
    data,
    page,
    pageSize,
    loading,
    keyword,
    searchKeyword,
    valueBerth,
    searchBerth,
    valueVessel,
    searchVessel,
    sortModel,
    vessels,
    onReset,
    onPageChange,
    onPageSizeChange,
    onDelete,
    onViewDetail,
    onSubmit,
    fetchData,
    setKeyword,
    setValueBerth,
    setValueVessel,
    onSortModelChange,
    onResync,
    onReplay,
  } = pageHook;

  useEffect(() => {
    setPageTitle(t("record-management:title"));
    setPageTitle({
      id: "record-management:page-title.list",
    });
    setBreadcrumbsList({
      id: "record-management:list",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchKeyword, sortModel, searchBerth, searchVessel]);

  return (
    <PagePermissionCheck
      feature={FEATURES.RECORDING_MANAGEMENT}
      redirectTo="/dashboard/account-info"
    >
      <DesktopView>
        <div className="main-content record-management-container">
          <h1 className="main-title">{t("record-management:title")}</h1>

          <Grid container spacing={2}>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <SharedSelectField
                className="text-normal"
                label={t("record-management:vessel")}
                disableClearable
                name="spm"
                options={[
                  {
                    value: "",
                    label: t("common:input.all-items"),
                  },
                  ...vessels?.map((vessel) => {
                    return {
                      value: vessel?.id,
                      label: i18n.language.includes("en")
                        ? vessel?.nameEn
                        : vessel?.name,
                    };
                  }),
                ]}
                defaultValue={valueVessel}
                onChange={(_, value) => {
                  setValueVessel(value);
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
            <Box>
              {/* <Link to={"/dashboard/users/add"}>
                <Button className="custom-button light-button" type="button">
                  {t("record-management:button.add")}
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
              viewDetail: onViewDetail,
              delete: onDelete,
              resync: onResync,
              replay: onReplay,
            }}
            disabledControls={{
              resync: () =>
                !hasPermission(FEATURES.RECORDING_MANAGEMENT, ACTIONS.UPDATE),
              // replay: () => true,
              delete: () =>
                !hasPermission(FEATURES.RECORDING_MANAGEMENT, ACTIONS.DELETE),
            }}
          />
        </div>
      </DesktopView>

      <MobileView AppBar={<MenuAppBar title={t("record-management:title")} />}>
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default RecordManagementListPage;
