import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "assets/images/record-management/delete.svg";
import moment from "moment";

export const ListPageContent = (t, language) => {
  return {
    columns: [
      {
        field: "name",
        headerName: t("berth:general_information.berth_name"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (_, row) =>
          language.includes("en") ? row?.nameEn : row?.name,
      },
      {
        field: "status",
        headerName: t("berth:general_information.berth_status"),
        align: "left",
        width: 200,
        sortable: true,
        renderCell: (value) =>
          language.includes("en") ? value?.nameEn : value?.name,
      },
      {
        field: "createdAt",
        headerName: t("berth:create_time"),
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
