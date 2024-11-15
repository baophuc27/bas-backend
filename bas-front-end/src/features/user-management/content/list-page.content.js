// import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
// import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
// import LockReset from '@material-ui/icons/VpnKeyOutlined';
// import { LimitBox } from "common/components/limit-box";

export const ListPageContent = (t, language) => {
  return {
    columns: [
      // {
      //   field: "userAccount",
      //   headerName: t("user-management:account"),
      //   align: "left",
      //   width: 220,
      //   sortable: true,
      //   renderCell: (params) => <LimitBox maxWidth={220}>{params}</LimitBox>,
      // },
      {
        field: "fullName",
        headerName: t("user-management:full-name"),
        align: "left",
        width: 200,
        sortable: true,
      },
      {
        field: "email",
        headerName: "Email",
        align: "left",
        width: 100,
        sortable: true,
      },
      // {
      //   field: "phone",
      //   headerName: t("user-management:phone-number"),
      //   align: "left",
      //   width: 200,
      //   sortable: true,
      // },
      {
        field: "role",
        // headerName: t("user-management:permission"),
        headerName: "Role",
        align: "left",
        width: 150,
        sortable: false,
        // renderCell: (params) =>
        //   language.includes("vi") ? params?.nameVi : params?.nameEn,
      },
      {
        field: "created_at",
        headerName: t("user-management:created-at"),
        align: "left",
        width: 150,
        sortable: true,
      },
    ],
    actions: {
      // edit: <EditOutlinedIcon style={{ fontSize: "20px" }} />,
      // resetPass: <LockReset style={{ fontSize: "20px" }} />,
      // delete: <DeleteOutlinedIcon style={{ fontSize: "20px" }} />,
    },
  };
};
