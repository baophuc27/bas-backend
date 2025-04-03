import {
  Box,
  Button,
  IconButton,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { t } from "i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import berthWidgetStyle from "./berth-widget.style.module.css";

export const BerthWidget = ({ berthData }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const navigate = useNavigate();

  // Set false to hide the berth length row, true to show it.
  const showBerthLength = false;

  const onToggleMinimize = () => setIsMinimized((prev) => !prev);

  return (
    <Box className={berthWidgetStyle.container}>
      <Box
        display="flex"
        alignItems="center"
        className={berthWidgetStyle.header}
      >
        <Box flex={1}>
          <Box className={berthWidgetStyle.nameText}>
            {/* {i18next.language.includes("en")
              ? berthData?.nameEn
              : berthData?.name} */}
            {berthData?.name}
          </Box>
        </Box>

        <IconButton
          onClick={onToggleMinimize}
          disableRipple
          className={berthWidgetStyle.minimizeButton}
        >
          {isMinimized ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      <Box
        textAlign="center"
        className={
          isMinimized
            ? `${berthWidgetStyle.content} ${berthWidgetStyle.minimized}`
            : berthWidgetStyle.content
        }
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow className={berthWidgetStyle.zoneRow}>
                <TableCell style={{ maxWidth: 100, padding: "12px 16px" }}>
                  {t("berth:general_information.ZONE")} 3
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>
                  {berthData?.limitZone3}
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>m</TableCell>
              </TableRow>
              <TableRow className={berthWidgetStyle.zoneRow}>
                <TableCell style={{ maxWidth: 100, padding: "12px 16px" }}>
                  {t("berth:general_information.ZONE")} 2
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>
                  {berthData?.limitZone2}
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>m</TableCell>
              </TableRow>
              <TableRow className={berthWidgetStyle.zoneRow}>
                <TableCell style={{ maxWidth: 100, padding: "12px 16px" }}>
                  {t("berth:general_information.ZONE")} 1
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>
                  {berthData?.limitZone1}
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>m</TableCell>
              </TableRow>
              <TableRow className={berthWidgetStyle.berthRow}>
                <TableCell style={{ maxWidth: 100 }}>
                  {t(
                    "berth:parameter_berth_layout.distance_from_left_sensor_to_left_edge",
                  )}
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>
                  {berthData?.distanceFender}
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>m</TableCell>
              </TableRow>
              <TableRow className={berthWidgetStyle.berthRow}>
                <TableCell style={{ maxWidth: 100 }}>
                  {t(
                    "berth:parameter_berth_layout.distance_between_two_sensors",
                  )}
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>
                  {berthData?.distanceDevice}
                </TableCell>
                <TableCell style={{ maxWidth: 30 }}>m</TableCell>
              </TableRow>
              {showBerthLength && (
                <TableRow className={berthWidgetStyle.berthRow}>
                  <TableCell style={{ maxWidth: 100, padding: "12px 16px" }}>
                    {t("berth:parameter_berth_layout.berth_length")}
                  </TableCell>
                  <TableCell style={{ maxWidth: 30 }}>74</TableCell>
                  <TableCell style={{ maxWidth: 30 }}>m</TableCell>
                </TableRow>
              )}
            </TableHead>
          </Table>
        </TableContainer>

        <Box mt={2} mx={2}>
          <Button
            className="custom-button light-button"
            type="button"
            style={{ width: "100%" }}
            onClick={() =>
              navigate(`/dashboard/berth-management/edit/${berthData?.id}`)
            }
          >
            {t("berth:berth_setting")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
