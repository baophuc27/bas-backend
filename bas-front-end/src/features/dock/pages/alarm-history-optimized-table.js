import { Box, IconButton } from "@material-ui/core";
import CropFreeIcon from "@material-ui/icons/CropFree";
import SettingsIcon from "@material-ui/icons/Settings";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
import { usePermission } from "common/hooks";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./alarm-history-optimized-table.style.module.css";

const FullScreenContainer = ({ children, onClickFullScreen = () => {} }) => {
  const { t } = useTranslation();

  return (
    <Box className={styles.fullScreenContainer}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={styles.header}
      >
        <p className={styles.mainTitle}>{t("dock:alarm-history.title")}</p>

        <Box display="flex">
          <IconButton onClick={onClickFullScreen} disableRipple>
            <CropFreeIcon />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.dataTableHeaderRow}>
        <Box className={styles.dataTableHeaderCell}>
          {t("dock:alarm-history.type")}
        </Box>
        <Box className={styles.dataTableHeaderCell}>
          {t("dock:alarm-history.sensor")}
        </Box>
        <Box className={styles.dataTableHeaderCell}>
          {t("dock:alarm-history.value")}
        </Box>
        <Box className={styles.dataTableHeaderCell}>
          {t("dock:alarm-history.zone")}
        </Box>
        <Box className={styles.dataTableHeaderCell}>
          {t("dock:alarm-history.start-time")}
        </Box>
        <Box className={styles.dataTableHeaderCell}>
          {t("dock:alarm-history.end-time")}
        </Box>
      </Box>

      <Box className={styles.main}>{children}</Box>
    </Box>
  );
};

const NormalContainer = ({
  children,
  onClickFullScreen = () => {},
  onClickSettings = () => {},
}) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  return (
    <Box
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      p={2}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <p className={styles.mainTitle}>{t("dock:alarm-history.title")}</p>

        <Box display="flex">
          {hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT) && (
            <IconButton onClick={onClickSettings} disableRipple>
              <SettingsIcon />
            </IconButton>
          )}

          <IconButton onClick={onClickFullScreen} disableRipple>
            <CropFreeIcon />
          </IconButton>
        </Box>
      </Box>

      <Box style={{ overflowX: "auto" }}>
        <Box className={styles.dataTableHeaderRow}>
          <Box className={styles.dataTableHeaderCell}>
            {t("dock:alarm-history.type")}
          </Box>
          <Box className={styles.dataTableHeaderCell}>
            {t("dock:alarm-history.sensor")}
          </Box>
          <Box className={styles.dataTableHeaderCell}>
            {t("dock:alarm-history.value")}
          </Box>
          <Box className={styles.dataTableHeaderCell}>
            {t("dock:alarm-history.zone")}
          </Box>
          <Box className={styles.dataTableHeaderCell}>
            {t("dock:alarm-history.start-time")}
          </Box>
          <Box className={styles.dataTableHeaderCell}>
            {t("dock:alarm-history.end-time")}
          </Box>
        </Box>

        <Box>{children}</Box>
      </Box>
    </Box>
  );
};

const Container = ({
  isFullScreen = false,
  children,
  onClickSettings = () => {},
  onClickFullScreen = () => {},
}) => {
  if (isFullScreen) {
    return (
      <FullScreenContainer onClickFullScreen={onClickFullScreen}>
        {children}
      </FullScreenContainer>
    );
  }

  return (
    <NormalContainer
      onClickSettings={onClickSettings}
      onClickFullScreen={onClickFullScreen}
    >
      {children}
    </NormalContainer>
  );
};

const DataTable = ({ data = [], height = 500 }) => {
  const parentRef = useRef();
  const rowVirtualizer = useVirtualizer({
    count: data?.length,
    getScrollElement: () => parentRef?.current,
    estimateSize: () => 45,
  });

  return (
    <Box className={styles.dataTableBody}>
      <div
        ref={parentRef}
        style={{
          height,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                alignItems: "center",
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                borderBottom: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  borderLeft: "none",
                  background: data?.[virtualItem?.index]?.alarmColor,
                  alignItems: "center",
                  justifyContent: "center",
                  height: `${virtualItem.size}px`,
                  borderBottom: "1px solid #eee",
                }}
              >
                <img src={data?.[virtualItem?.index]?.iconType} alt="" />
              </div>
              <div
                className={styles.dataTableBodyCell}
                style={{
                  height: `${virtualItem.size}px`,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {data?.[virtualItem?.index]?.sensor}
              </div>
              <div
                className={styles.dataTableBodyCell}
                style={{
                  height: `${virtualItem.size}px`,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {data?.[virtualItem?.index]?.value}
              </div>
              <div
                className={styles.dataTableBodyCell}
                style={{
                  height: `${virtualItem.size}px`,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {data?.[virtualItem?.index]?.zone}
              </div>
              <div
                className={styles.dataTableBodyCell}
                style={{
                  height: `${virtualItem.size}px`,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {data?.[virtualItem?.index]?.startTime}
              </div>
              <div
                className={styles.dataTableBodyCell}
                style={{
                  height: `${virtualItem.size}px`,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {data?.[virtualItem?.index]?.endTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export const AlarmHistoryOptimizedTable = ({
  onClickSettings = () => {},
  realtimeData = [],
  pastData = [],
  hasRealtimeData = false,
  hasPastData = false,
}) => {
  const { t } = useTranslation();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const onToggleFullScreen = () => setIsFullScreen((prev) => !prev);

  const data = useMemo(() => {
    return [...realtimeData, ...pastData];
  }, [realtimeData, pastData]);

  return (
    <Container
      isFullScreen={isFullScreen}
      onClickFullScreen={onToggleFullScreen}
      onClickSettings={onClickSettings}
    >
      {(hasRealtimeData || hasPastData) && (
        <DataTable data={data} height={isFullScreen ? "100%" : 500} />
      )}

      {!hasRealtimeData && !hasPastData && (
        <Box className={styles.noDataContainer}>
          <Box className={styles.noDataText}>{t("common:label.no-data")}</Box>
        </Box>
      )}
    </Container>
  );
};
