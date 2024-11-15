import { SystemPermission } from './system-permission';

export const roleMatrix: Record<string, string[]> = {
  VIEW: [
    SystemPermission.PORT_DASHBOARD_VIEW,
    SystemPermission.BERTH_DASHBOARD_VIEW,
    SystemPermission.ALARM_SETTING_VIEW,
  ],
  CONFIGURE: [
    SystemPermission.PORT_DASHBOARD_VIEW,
    SystemPermission.BERTH_DASHBOARD_VIEW,
    SystemPermission.BERTH_DASHBOARD_EDIT,
    SystemPermission.RECORDING_MANAGEMENT_VIEW,
    SystemPermission.RECORDING_MANAGEMENT_EDIT,
    SystemPermission.ALARM_MANAGEMENT_VIEW,
    SystemPermission.ALARM_SETTING_VIEW,
    SystemPermission.ALARM_SETTING_EDIT,
    SystemPermission.PORT_INFORMATION_VIEW,
    SystemPermission.BERTH_MANAGEMENT_CREATE,
    SystemPermission.BERTH_MANAGEMENT_EDIT,
    SystemPermission.BERTH_MANAGEMENT_VIEW,
    SystemPermission.VESSEL_MANAGEMENT_CREATE,
    SystemPermission.VESSEL_MANAGEMENT_EDIT,
    SystemPermission.VESSEL_MANAGEMENT_VIEW,
  ],
  ADMIN: [...Object.values(SystemPermission)],
};
