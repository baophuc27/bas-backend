export const DATA_APP_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    ERROR: 'ERROR'
  }
  

  // Status display config for UI (optional)
  export const DATA_APP_STATUS_CONFIG = {
    [DATA_APP_STATUS.ACTIVE]: {
      color: '#4caf50',  // Green color for active status
      label: 'Active',
      icon: 'check-circle'
    },
    [DATA_APP_STATUS.INACTIVE]: {
      color: '#9e9e9e',  // Grey color for inactive status
      label: 'Inactive',
      icon: 'minus-circle'
    },
    [DATA_APP_STATUS.ERROR]: {
      color: '#f44336',  // Red color for error status
      label: 'Error',
      icon: 'error'
    }
  };
  
  // Heartbeat configuration
  export const DATA_APP_CONFIG = {
    HEARTBEAT_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
    INACTIVE_THRESHOLD: 5 * 60 * 1000,  // 5 minutes in milliseconds
  }