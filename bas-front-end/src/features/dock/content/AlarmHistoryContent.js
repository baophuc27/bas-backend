// import ParameterIcon from "shared/assets/icons/parameter-icon";
import { Box } from "@material-ui/core";
import AngleIcon from "assets/images/angle.svg";
import DistanceIcon from "assets/images/distance.svg";
import SpeedIcon from "assets/images/speed.svg";

const renderValue = (item) => {
  let color = "white";

  switch (item?.status) {
    case 1:
      color = "#FFE146";
      break;

    case 2:
      color = "#EA3636";
      break;
  }

  return {
    backgroundColor: color,
  };
};

const AlarmHistoryContent = (intl) => {
  return {
    columns: [
      {
        field: "type",
        headerName: "Type",
        align: "left",
        sortable: false,
        renderCell: (value) => {
          let icon = "";

          switch (value) {
            case "ANGLE":
              icon = AngleIcon;
              break;

            case "DISTANCE":
              icon = DistanceIcon;
              break;

            case "SPEED":
              icon = SpeedIcon;
              break;
          }

          return (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={icon} alt="" />
            </Box>
          );
        },
        condition: (_, item) => renderValue(item),
      },
      {
        field: "sensor",
        headerName: "Sensor",
        align: "left",
        sortable: false,
      },
      {
        field: "value",
        headerName: "Value",
        // headerName: intl.formatMessage({ id: "BAS_ADMIN.DASHBOARD.VALUE" }),
        align: "left",
        sortable: false,
      },
      {
        field: "zone",
        headerName: "Zone",
        // headerName: intl.formatMessage({ id: "BAS_ADMIN.DASHBOARD.ZONE" }),
        align: "left",
        sortable: false,
      },
      {
        field: "start_time",
        headerName: "Start Time",
        // headerName: intl.formatMessage({ id: "BAS_ADMIN.DASHBOARD.START" }),
        align: "left",
        sortable: false,
        width: 30,
      },
      {
        field: "end_time",
        headerName: "End Time",
        // headerName: intl.formatMessage({ id: "BAS_ADMIN.DASHBOARD.END" }),
        align: "left",
        sortable: false,
      },
    ],
    rows: [
      {
        field: "id",
        type: "text",
        default: "",
      },
    ],
    actions: {},
  };
};
export default AlarmHistoryContent;
