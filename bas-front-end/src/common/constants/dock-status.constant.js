export const DOCK_STATUS = {
  DOCKING: 1,
  LEAVING: 2,
  EMPTY: 3,
};

export const DOCK_STATUS_LABEL = {
  [DOCK_STATUS.DOCKING]: {
    en: "Docking",
    vi: "Đang Cập Bến",
  },
  [DOCK_STATUS.LEAVING]: {
    en: "Leaving",
    vi: "Đang Rời Bến",
  },
  [DOCK_STATUS.EMPTY]: {
    en: "Empty",
    vi: "Trống",
  },
};
