const ROLE = {
  ADMIN: 8,
  CONFIGURATOR: 9,
  VIEWER: 10,
};

export const getRoleLabel = (t, id) => {
  switch (id) {
    case ROLE.ADMIN:
      return t("common:role.admin");
    case ROLE.CONFIGURATOR:
      return t("common:role.config");
    case ROLE.VIEWER:
      return t("common:role.viewer");
    default:
      return "";
  }
};

export const roleMatrix = {
  "/": {
    [ROLE.ADMIN]: {
      view: true,
    },
    [ROLE.TECHNICIAN]: {
      view: true,
    },
    [ROLE.USER]: {
      view: true,
    },
  },
  "/dashboard": {
    [ROLE.ADMIN]: {
      view: true,
    },
    [ROLE.TECHNICIAN]: {
      view: true,
    },
    [ROLE.USER]: {
      view: true,
    },
  },
  "/dashboard/account-info": {
    [ROLE.ADMIN]: {
      view: true,
      edit: true,
    },
    [ROLE.TECHNICIAN]: {
      view: true,
      edit: true,
    },
    [ROLE.USER]: {
      view: true,
      edit: true,
    },
  },
  "/dashboard/notifications": {
    [ROLE.ADMIN]: {
      view: true,
      delete: true,
    },
    [ROLE.TECHNICIAN]: {
      view: true,
      delete: true,
    },
    [ROLE.USER]: {
      view: true,
      delete: true,
    },
  },
  "/dashboard/system-notifications": {
    [ROLE.ADMIN]: {
      view: true,
      delete: true,
    },
    [ROLE.TECHNICIAN]: {
      view: false,
      delete: false,
    },
    [ROLE.USER]: {
      view: false,
      delete: false,
    },
  },
  "/dashboard/users": {
    [ROLE.ADMIN]: {
      view: true,
      edit: true,
      delete: true,
      add: true,
    },
    [ROLE.TECHNICIAN]: {
      view: false,
      edit: false,
      delete: false,
      add: false,
    },
    [ROLE.USER]: {
      view: false,
      edit: false,
      delete: false,
      add: false,
    },
  },
  "/dashboard/spms": {
    [ROLE.ADMIN]: {
      view: true,
      edit: true,
      delete: true,
      add: true,
    },
    [ROLE.TECHNICIAN]: {
      view: true,
      edit: true,
      delete: true,
      add: true,
    },
    [ROLE.USER]: {
      view: false,
      edit: false,
      delete: false,
      add: false,
    },
  },
  "/dashboard/detection-devices": {
    [ROLE.ADMIN]: {
      view: true,
      edit: true,
      delete: true,
      add: true,
    },
    [ROLE.TECHNICIAN]: {
      view: false,
      edit: false,
      delete: false,
      add: false,
    },
    [ROLE.USER]: {
      view: false,
      edit: false,
      delete: false,
      add: false,
    },
  },
  "/dashboard/detection-histories": {
    [ROLE.ADMIN]: {
      view: true,
      edit: true,
      delete: true,
      add: true,
    },
    [ROLE.TECHNICIAN]: {
      view: true,
      edit: true,
      delete: true,
      add: true,
    },
    [ROLE.USER]: {
      view: true,
      edit: true,
      delete: true,
      add: true,
    },
  },
  "/dashboard/back-up-data": {
    [ROLE.ADMIN]: {
      view: true,
      delete: true,
      add: true,
    },
    [ROLE.TECHNICIAN]: {
      view: true,
      delete: true,
      add: true,
    },
    [ROLE.USER]: {
      view: false,
      delete: false,
      add: false,
    },
  },
};
