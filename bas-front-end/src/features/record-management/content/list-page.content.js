import DeleteIcon from "assets/images/record-management/delete.svg";
import ReplayIcon from "assets/images/record-management/replay.svg";
import ResyncIcon from "assets/images/record-management/resync.svg";
import ViewDetailIcon from "assets/images/record-management/view-detail.svg";
import {
  getMooringStatus,
  getSyncStatus,
} from "common/constants/berth.constant";
import moment from "moment";

export const ListPageContent = (t, language) => {
  return {
    columns: [
      {
        field: "sessionId",
        headerName: t("record-management:session_id"),
        align: "left",
        width: 200,
        sortable: true,
      },
      {
        field: "startTime",
        headerName: t("record-management:start_time"),
        align: "left",
        width: 165,
        sortable: true,
        renderCell: (params) =>
          moment(params).format("DD-MM-YYYY HH:mm:ss:SSS"),
      },
      {
        field: "endTime",
        headerName: t("record-management:end_time"),
        align: "left",
        width: 165,
        sortable: true,
        renderCell: (params) => {
          return moment(params).format("DD-MM-YYYY HH:mm:ss:SSS");
        },
      },
      {
        field: "berth",
        headerName: t("record-management:berth"),
        align: "left",
        width: 100,
        sortable: true,
        renderCell: (params) =>
          language.includes("vi") ? params?.name : params?.nameEn,
      },
      {
        field: "vessel",
        headerName: t("record-management:vessel"),
        align: "left",
        width: 100,
        sortable: true,
        renderCell: (params) => {
          return language.includes("vi") ? params?.name : params?.nameEn;
        },
      },
      {
        field: "mooringStatus",
        headerName: t("record-management:anchoring_status"),
        align: "left",
        width: 180,
        sortable: true,
        renderCell: (params) => {
          return getMooringStatus(t, params);
        },
      },
      {
        field: "syncStatus",
        headerName: t("record-management:sync_status"),
        align: "left",
        width: 150,
        sortable: true,
        renderCell: (params) => {
          return getSyncStatus(t, params);
        },
      },
    ],
    actions: {
      viewDetail: (
        <img src={ViewDetailIcon} alt="View Detail" width={24} height={24} />
      ),
      // resync: <img src={ResyncIcon} alt="Resync" width={20} height={23} />,
      replay: <img src={ReplayIcon} alt="Replay" width={24} height={24} />,
      delete: <img src={DeleteIcon} alt="Delete" width={24} height={24} />,
    },
  };
};
