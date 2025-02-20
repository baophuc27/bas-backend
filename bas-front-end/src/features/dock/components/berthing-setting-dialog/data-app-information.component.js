import React from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip
} from "@material-ui/core";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from "@material-ui/icons";
import { t } from "i18next";
import styles from "./berthing-setting-dialog.style.module.css";

const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString();
};

const StatusIcon = ({ status, lastHeartbeat, lastDataActive }) => {
  const getIcon = () => {
    switch (status) {
      case 'NORMAL':
        return <CheckCircleIcon style={{ color: '#4CAF50' }} />;
      case 'DISCONNECTED':
        return <ErrorIcon style={{ color: '#FF9800' }} />;
      case 'INACTIVE':
      default:
        return <CancelIcon style={{ color: '#757575' }} />;
    }
  };

  const tooltipContent = (
    <div>
      <div>{t("data-app:general_information.last_heartbeat")}: {formatDateTime(lastHeartbeat)}</div>
      <div>{t("data-app:general_information.last_data_active")}: {formatDateTime(lastDataActive)}</div>
    </div>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <span>{getIcon()}</span>
    </Tooltip>
  );
};

const DataAppInformation = ({
  dataAppList = [],
  handleChange,
  loading = false,
  currentBerthId
}) => {
  const assignedDataApp = dataAppList.find(app => 
    app.berthId === (currentBerthId ? Number(currentBerthId) : null)
  );
  const isFixed = assignedDataApp?.type === 'FIXED';

  const renderMenuItem = (app) => {
    const isOccupied = app.berthId && app.berthId !== Number(currentBerthId);
    
    return (
      <MenuItem 
        key={app.code} 
        value={app.code}
        disabled={isOccupied}
        style={{
          height: 'auto',
          padding: '12px 16px',
          whiteSpace: 'normal',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: isOccupied ? '#f5f5f5' : 'transparent'
        }}
      >
        <Grid container direction="column" spacing={1}>
          <Grid item container justifyContent="space-between" alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column">
                <span style={{ fontWeight: 500 }}>{app.code}</span>
                <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>{app.displayName || '-'}</span>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                <StatusIcon 
                  status={app.status}
                  lastHeartbeat={app.lastHeartbeat}
                  lastDataActive={app.lastDataActive}
                />
                <span style={{ marginLeft: '8px', color: 'rgba(0, 0, 0, 0.6)' }}>
                  {t(`data-app:data_app_information.status_${app.status.toLowerCase()}`)}
                </span>
              </Box>
            </Grid>
          </Grid>
          {isOccupied && (
            <Grid item xs={12}>
              <Box
                style={{
                  backgroundColor: '#757575',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}
              >
                Running at {app.berth?.name || 'Other Berth'}
              </Box>
            </Grid>
          )}
        </Grid>
      </MenuItem>
    );
  };

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
              disabled={loading || isFixed}
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
              {dataAppList.map(renderMenuItem)}
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
      </Grid>
    </div>
  );
};

export default DataAppInformation;