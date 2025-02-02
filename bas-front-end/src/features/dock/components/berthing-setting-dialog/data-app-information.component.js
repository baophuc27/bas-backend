import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@material-ui/core";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from "@material-ui/icons";
import { t } from "i18next";
import { useEffect } from "react";
import styles from "./berthing-setting-dialog.style.module.css";

const getStatusIcon = (status) => {
  switch (status) {
    case 'NORMAL':
      return <CheckCircleIcon style={{ color: '#4CAF50' }} />;
    case 'HAVE_HEARTBEAT':
      return <CheckCircleIcon style={{ color: '#2196F3' }} />;
    case 'DISCONNECTED':
      return <ErrorIcon style={{ color: '#FF9800' }} />;
    case 'INACTIVE':
    default:
      return <CancelIcon style={{ color: '#757575' }} />;
  }
};

const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString();
};

const DataAppInformation = ({
  dataAppList = [],
  handleChange,
  loading = false,
  isRecord = false,
  currentBerthId
}) => {
  console.log('Rendering DataAppInformation with:', {
    dataAppListLength: dataAppList.length,
    dataAppList,
    currentBerthId,
    loading,
    isRecord
  });
  useEffect(() => {
    console.log('DataAppInformation dataAppList:', dataAppList);
  }, [dataAppList]);

  // Get the currently assigned data app for this berth
  const assignedDataApp = dataAppList.find(app => 
    app.berthId === (currentBerthId ? Number(currentBerthId) : null)
  );

  return (
    <div className={styles.section}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="data-app-select-label">
              {t("data-app:data_app_information.selected_data_app")}
            </InputLabel>
            <Select
              labelId="data-app-select-label"
              id="data-app-select"
              value={assignedDataApp?.code || ''}
              onChange={handleChange}
              disabled={loading}
              label={t("data-app:data_app_information.selected_data_app")}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>{t("data-app:data_app_information.select_data_app")}</em>
              </MenuItem>
              {dataAppList.map((app) => (
                <MenuItem 
                  key={app.code} 
                  value={app.code}
                  style={{
                    height: 'auto',
                    padding: '12px 16px',
                    whiteSpace: 'normal',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                      <Box display="flex" flexDirection="column">
                        <span style={{ fontWeight: 500 }}>{app.code}</span>
                        <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>{app.displayName || '-'}</span>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        {getStatusIcon(app.status)}
                        <span style={{ marginLeft: '8px', color: 'rgba(0, 0, 0, 0.6)' }}>
                          {t(`data-app:data_app_information.status_${app.status.toLowerCase()}`)}
                          {app.berthId && app.berthId !== Number(currentBerthId) && 
                            ` (${app.berth?.name || 'Other Berth'})`}
                        </span>
                      </Box>
                    </Grid>
                  </Grid>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          </Grid>
        )}

        {assignedDataApp && !loading && (
          <>
            <Grid item xs={6}>
              <Box className="form-label">
                {t("data-app:general_information.data_app_name")}
              </Box>
              <Box className={styles.dataInfo}>
                {assignedDataApp.displayName || '-'}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box className="form-label">
                {t("data-app:general_information.data_app_status")}
              </Box>
              <Box className={styles.statusContainer}>
                {getStatusIcon(assignedDataApp.status)}
                <span className={styles.statusText}>
                  {t(`data-app:data_app_information.status_${assignedDataApp.status.toLowerCase()}`)}
                </span>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box className="form-label">
                {t("data-app:general_information.last_heartbeat")}
              </Box>
              <Box className={styles.dataInfo}>
                {formatDateTime(assignedDataApp.lastHeartbeat)}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box className="form-label">
                {t("data-app:general_information.last_data_active")}
              </Box>
              <Box className={styles.dataInfo}>
                {formatDateTime(assignedDataApp.lastDataActive)}
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DataAppInformation;