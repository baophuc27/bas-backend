import DeleteIcon from "assets/images/record-management/delete.svg";
import moment from "moment";

export const ListPageContent = (t, language) => {
  return {
    columns: [
      {
        field: "startTime",
        headerName: t("record-management:start_time"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (value) =>
          value ? moment(value).format("DD-MM-YYYY HH:mm:ss:SSS") : "",
      },
      {
        field: "endTime",
        headerName: t("record-management:end_time"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (value) =>
          value ? moment(value).format("DD-MM-YYYY HH:mm:ss:SSS") : "",
      },
      {
        field: "sessionId",
        headerName: t("record-management:session_id"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (_, row) => row?.record?.sessionId,
      },
      {
        field: "berth",
        headerName: t("record-management:berth"),
        align: "left",
        width: 100,
        sortable: true,
        renderCell: (_, row) =>
          language.includes("en")
            ? row?.record?.berth?.nameEn
            : row?.record?.berth?.name,
      },
      {
        field: "sensor",
        headerName: t("alarm:sensor"),
        align: "left",
        width: 50,
        sortable: false,
        renderCell: (_, row) => row?.sensor?.name,
      },
      {
        field: "zone",
        headerName: t("alarm:zone"),
        align: "left",
        width: 50,
        sortable: false,
      },
      {
        field: "type",
        headerName: t("alarm:type"),
        align: "left",
        width: 120,
        sortable: true,
        renderCell: (value) => t(`alarm:${value}`),
      },
      {
        field: "value",
        headerName: t("alarm:value"),
        align: "left",
        width: 100,
        sortable: false,
        renderCell: (value) => value.toFixed(2),
      },
      {
        field: "alarm",
        headerName: t("alarm:alarm_value"),
        align: "left",
        width: 150,
        sortable: true,
        renderCell: (value) =>
          value === 2 ? t("alarm:warning") : t("alarm:emergency"),
      },
      {
        field: "message",
        headerName: t("alarm:alarm_message"),
        align: "left",
        width: 165,
        sortable: true,
      },
    ],
    actions: {
      delete: <img src={DeleteIcon} alt="Delete" width={24} height={24} />,
    },
  };
};
