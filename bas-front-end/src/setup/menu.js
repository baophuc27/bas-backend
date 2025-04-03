import { History } from "@material-ui/icons";
import {
  Belt,
  BerthManagement,
  DataApp,
  LogOut,
  Port,
  RecordManagement,
  User,
  UserGroup,
} from "common/components/icons";
import { FEATURES } from "common/constants/feature.constant";

export const mineItems = [
  {
    labelId: "common:menu.items.account-info",
    icon: User,
    to: "/dashboard/record-management",
  },
  {
    labelId: "common:menu.items.notifications",
    icon: Belt,
    to: "/dashboard/notifications",
  },
  {
    labelId: "common:menu.items.log-out",
    icon: LogOut,
    to: "/auth/log-out",
  },
];

const menuItems = [
  {
    labelId: "common:menu.items.users-management",
    icon: UserGroup,
    to: "/dashboard/users",
    feature: FEATURES.USERS_MANAGEMENT,
  },
  {
    labelId: "common:menu.items.record_management",
    icon: RecordManagement,
    to: "/dashboard/record-management",
    feature: FEATURES.RECORDING_MANAGEMENT,
  },
  {
    labelId: "common:menu.items.alarm-history",
    icon: History,
    to: "/dashboard/alarm-history",
    feature: FEATURES.ALARM_MANAGEMENT,
  },
  {
    labelId: "common:menu.items.port-info",
    icon: Port,
    to: "/dashboard/port-info",
    feature: FEATURES.PORT_INFORMATION,
  },
  {
    labelId: "common:menu.items.berth_management",
    icon: BerthManagement,
    to: "/dashboard/berth-management",
    feature: FEATURES.BERTH_MANAGEMENT,
  },
  {
    labelId: "common:menu.items.account-info",
    icon: User,
    to: "/dashboard/account-info",
    common: true,
  },
  {
    labelId: "common:menu.items.data-app-management",
    icon: DataApp,
    to: "/dashboard/data-app-management",
    feature: FEATURES.BERTH_MANAGEMENT,
    // common: true,
  },
  {
    labelId: "common:menu.items.log-out",
    icon: LogOut,
    to: "/auth/log-out",
    common: true,
  },
];

export const menuSections = [
  {
    labelId: "common:menu.sections.menu",
    items: menuItems,
  },
];
