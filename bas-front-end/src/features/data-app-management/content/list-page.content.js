import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "assets/images/record-management/delete.svg";
import moment from "moment";

export const ListPageContent = (t, language) => {
  return {
    columns: [
      {
        field: "code",
        headerName: t("data-app:general_information.code"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (_, row) => row?.code,
      },
      {
        field: "berthId",
        headerName: t("data-app:general_information.berth"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (_, row) => row?.berth?.name,
      },
      {
        field: "displayName",
        headerName: t("data-app:general_information.data_app_name"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (_, row) => row?.displayName,
      },
      {
        field: "status",
        headerName: t("data-app:general_information.data_app_status"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (_,row) => row?.status
      },
      {
        field: "createdAt",
        headerName: t("data-app:general_information:created_time"),
        align: "left",
        width: 165,
        sortable: true,
        renderCell: (params) => moment(params).format("DD-MM-YYYY"),
      },
      {
        field: "lastDataActive",
        headerName: t("data-app:general_information:last_data_active"),
        align: "left",
        width: 165,
        sortable: true,
        renderCell: (params) => moment(params).format("DD-MM-YYYY"),
      },
      {
        field: "lastHeartbeat",
        headerName: t("data-app:general_information:last_heartbeat"),
        align: "left",
        width: 165,
        sortable: true,
        renderCell: (params) => moment(params).format("DD-MM-YYYY"),
      },
    ],
    actions: {
      edit: <EditIcon style={{ color: "#777777" }} />,
      delete: <img src={DeleteIcon} alt="Delete" width={24} height={24} />,
    },
  };
};
