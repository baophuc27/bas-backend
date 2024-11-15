import { Box, IconButton } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { HabourService } from "common/services";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./widget.style.module.css";

export const Widget = (props) => {
  const { t } = useTranslation();
  // const habour = useSelector((state) => state?.habour);
  const [isMinimized, setIsMinimized] = useState(false);
  const [habour, setHabour] = useState({});

  const fetchHabourData = async () => {
    try {
      const response = await HabourService.getData();

      if (response?.data?.success) {
        setHabour(response?.data?.data);
      }
    } catch (error) {}
  };

  const onToggleMinimize = () => setIsMinimized((prev) => !prev);

  useEffect(() => {
    fetchHabourData();
  }, []);

  return (
    <Box className={styles.container}>
      <Box display="flex" alignItems="center">
        <Box flex={1}>
          <Box className={styles.name}>
            <LocationOnIcon fontSize="small" style={{ color: "#000" }} />

            <Box className={styles.nameText}>
              {i18next.language.includes("en") ? habour?.nameEn : habour?.name}
            </Box>
          </Box>
          <Box className={styles.address}>{habour?.address}</Box>
        </Box>

        <IconButton onClick={onToggleMinimize} disableRipple>
          {isMinimized ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {!isMinimized && (
        <Box textAlign="center">
          {habour?.weatherWidgetUrl !== "" && (
            // <Box mt={2} className={styles.iframeContainer}>
            <iframe
              className="iframe-container"
              src={habour?.weatherWidgetUrl}
              height={300}
              width={250}
              frameborder={0}
              style={{
                marginTop: 12,
              }}
            ></iframe>
            // </Box>
          )}

          {habour?.weatherWidgetDashboardUrl !== "" && (
            <Box mt={2}>
              <a
                href={habour?.weatherWidgetDashboardUrl}
                className="custom-button light-button"
                type="button"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                target="_blank"
              >
                {t("dock:weather-widget.button")}
              </a>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
