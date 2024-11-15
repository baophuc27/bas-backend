import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import {
  DesktopOnly,
  DesktopView,
  MenuAppBar,
  MobileView,
  PagePermissionCheck,
} from "common/components";
import {
  DEFAULT_PAGE,
  DEFAULT_ROWS_PER_PAGE_OPTIONS,
} from "common/components/infinite-shared-table/constants";
import { getMooringStatus } from "common/constants/berth.constant";
import { FEATURES } from "common/constants/feature.constant";
import { useQuery } from "common/hooks";
import { RecordManagementService } from "common/services";
import { notify } from "common/utils";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { RecordAggregateTable, SensorCharts } from "../components";
import { formatValue } from "../helpers";
import detailStyles from "./../styles/detail-record.style.module.css";
import styles from "./../styles/record-management.style.module.css";

const useStyles = makeStyles({
  tableContainer: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: 1000,
  },
});

const UserManagementAddPage = (props) => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const recordId = params.id;
  const tableStyle = useStyles();
  const [detailInfo, setDetailInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(+query.get("ppi") || DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(+query.get("ps") || 50);
  const [hasData, setHasData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const onPageSizeChange = (event) => {
    let params = {
      pageSize: event.target.value,
      page: 0,
    };

    setPageSize(params?.pageSize);
    setPage(params?.page);
  };

  const onPageChange = (_, newPage) => {
    let params = {
      pageSize: pageSize,
      page: newPage,
    };

    setPage(params?.page);
  };

  const onExportData = async () => {
    try {
      setIsExporting(true);

      const res = await RecordManagementService.exportData(
        recordId,
        i18n?.language?.includes("en") ? "en" : "vi"
      );

      if (res?.status === 200) {
        const url = window.URL.createObjectURL(
          new Blob([res?.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `records_${moment().format("DDMMYYYY_HHmm")}.xlsx`
        );

        document.body.appendChild(link);
        link.click();
        link.remove();

        notify("success", t("record-management:dialog.export_success_message"));
        setIsExporting(false);
      }
    } catch (err) {
      notify("error", t("record-management:dialog.export_error_message"));
      console.log(err.response?.data?.message);
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      RecordManagementService.getDetail(recordId, {
        page: page,
        amount: pageSize,
      }).then((res) => {
        if (res?.data?.success === false) {
          notify("error", t("record-management:record_not_found"));
          navigate("/dashboard/record-management");
          return;
        }
        setDetailInfo({
          ...res?.data?.data,
          count: res.data?.count,
        });

        setHasData(res?.data?.data?.recordHistories?.length > 0);
        setLoading(false);
      });
    };

    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId, page, pageSize, navigate]);

  const rows = useMemo(() => {
    if (!detailInfo?.recordHistories) return [];
    return detailInfo?.recordHistories.map((item) => {
      const zone = Math.min(
        item?.angleZone ?? Infinity,
        item?.LSpeedZone ?? Infinity,
        item?.RSpeedZone ?? Infinity,
        item?.LDistanceZone ?? Infinity,
        item?.RDistanceZone ?? Infinity
      );
      const angle = Math.abs(item?.angle);
      return {
        time: moment(item?.time).format("DD-MM-YYYY HH:mm:ss:SSS"),
        zone: zone === Infinity ? "--" : zone,
        leftDistance: formatValue(item?.leftDistance),
        leftSpeed: formatValue(item?.leftSpeed),
        rightDistance: formatValue(item?.rightDistance),
        rightSpeed: formatValue(item?.rightSpeed),
        angle: Number.isNaN(angle) ? "--" : formatValue(angle),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailInfo?.recordHistories]);

  return (
    <PagePermissionCheck feature={FEATURES.RECORDING_MANAGEMENT}>
      <DesktopView>
        <div className="main-content record-management-container">
          {loading && (
            <div className={detailStyles.loading}>
              <CircularProgress />
            </div>
          )}
          <p className={styles.title}>
            {t("record-management:detail_title")}{" "}
            <span className={styles.titleId}>{detailInfo?.id}</span>
          </p>
          <p className={styles.generalInfo}>
            {t("record-management:general_information")}
          </p>

          <Grid container>
            <Grid item xs={6} sm={4}>
              <p className={styles.infoItem}>
                <strong>{t("record-management:berth")}:</strong>{" "}
                <span>
                  {i18n.language.includes("en")
                    ? detailInfo?.berth?.nameEn
                    : detailInfo?.berth?.name}
                </span>
              </p>
              <p className={styles.infoItem}>
                <strong>{t("record-management:vessel")}:</strong>{" "}
                <span>
                  {i18n.language.includes("en")
                    ? detailInfo?.vessel?.nameEn
                    : detailInfo?.vessel?.name}
                </span>
              </p>
              <p className={styles.infoItem}>
                <strong>{t("record-management:session_id")}:</strong>{" "}
                <span>{detailInfo?.sessionId}</span>
              </p>
            </Grid>
            <Grid item xs={6} sm={4}>
              <p className={styles.infoItem}>
                <strong>{t("record-management:anchoring_status")}:</strong>{" "}
                <span>{getMooringStatus(t, detailInfo?.mooringStatus)}</span>
              </p>
              <p className={styles.infoItem}>
                <strong>{t("record-management:start_time")}:</strong>{" "}
                <span>
                  {moment(detailInfo?.startTime).format(
                    "HH:mm:ss:SSS DD-MM-YYYY"
                  )}
                </span>
              </p>
              <p className={styles.infoItem}>
                <strong>{t("record-management:end_time")}:</strong>{" "}
                <span>
                  {moment(detailInfo?.endTime).format(
                    "HH:mm:ss:SSS DD-MM-YYYY"
                  )}
                </span>
              </p>
            </Grid>
            <Grid item xs={6} sm={4} className={styles.linkToDeparting}>
              {/* <Link
                to={`/record-management/departing`}
                className={styles.linkToDepartingText}
              >
                {t("record-management:view_departing")} ({detailInfo?.id}){" "}
                {">>"}
              </Link> */}
            </Grid>
          </Grid>

          {hasData !== null && hasData === false && (
            <Box className={detailStyles.noDataContainer}>
              <img
                src="/images/no-data.jpg"
                alt="No Data"
                className={detailStyles.noDataImage}
              />

              <Box>{t("common:label.no-data")}</Box>
            </Box>
          )}

          {hasData === true && (
            <>
              <RecordAggregateTable recordId={recordId} />
              <SensorCharts recordId={recordId} />

              <p className={styles.historyTitle}>
                {t("record-management:history")}
              </p>

              <Paper className={tableStyle.tableContainer}>
                <Table className={tableStyle.table}>
                  <TableHead
                    style={{
                      backgroundColor: "#E5E5E5",
                    }}
                  >
                    <TableRow>
                      <TableCell />
                      <TableCell />
                      <TableCell
                        align="center"
                        colSpan={2}
                        className={styles.sensorHeader}
                      >
                        {t("berth:dock_information.left_sensor")}
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={2}
                        className={styles.sensorHeader}
                      >
                        {t("berth:dock_information.right_sensor")}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className={styles.headerSeparator}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">
                        {t("record-management:time")}
                      </TableCell>
                      <TableCell align="center" className={styles.headerItem}>
                        {t("record-management:zone")}
                      </TableCell>
                      <TableCell align="center" className={styles.headerItem}>
                        {t("record-management:distance")} (m)
                      </TableCell>
                      <TableCell align="center" className={styles.headerItem}>
                        {t("record-management:speed")} (cm/s)
                      </TableCell>
                      <TableCell align="center" className={styles.headerItem}>
                        {t("record-management:distance")} (m)
                      </TableCell>
                      <TableCell align="center" className={styles.headerItem}>
                        {t("record-management:speed")} (cm/s)
                      </TableCell>
                      <TableCell align="center" className={styles.headerItem}>
                        {t("record-management:angle")} (°)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.time}>
                        <TableCell>{row.time}</TableCell>
                        <TableCell align="center">{row.zone}</TableCell>
                        <TableCell align="center">{row.leftDistance}</TableCell>
                        <TableCell align="center">{row.leftSpeed}</TableCell>
                        <TableCell align="center">
                          {row.rightDistance}
                        </TableCell>
                        <TableCell align="center">{row.rightSpeed}</TableCell>
                        <TableCell align="center">{row.angle}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

              <TablePagination
                rowsPerPageOptions={DEFAULT_ROWS_PER_PAGE_OPTIONS}
                component="div"
                paginationmode="server"
                count={detailInfo?.count ?? 0}
                rowsPerPage={pageSize}
                nextIconButtonText={t("common:table.next-page")}
                backIconButtonText={t("common:table.previous-page")}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onPageSizeChange}
                labelRowsPerPage={t("common:table.rows-per-page")}
              />
            </>
          )}

          <Box mt={2} display="flex" alignItems="center">
            <Button
              className="custom-button success-button"
              disabled={isExporting || loading || detailInfo?.count === 0}
              onClick={onExportData}
            >
              {isExporting && (
                <CircularProgress
                  color="inherit"
                  size={16}
                  style={{ marginRight: 6 }}
                />
              )}

              {t("record-management:export")}
            </Button>
            <Button
              className="custom-button light-button"
              onClick={() => navigate("/dashboard/record-management")}
              style={{ marginLeft: 12 }}
            >
              {t("common:back")}
            </Button>
          </Box>
        </div>
      </DesktopView>

      <MobileView
        AppBar={<MenuAppBar title={t("record-management:detail_title")} />}
      >
        <DesktopOnly />
      </MobileView>
    </PagePermissionCheck>
  );
};

export default UserManagementAddPage;
