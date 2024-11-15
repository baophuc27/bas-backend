import { Box, IconButton } from "@material-ui/core";
import CropFreeIcon from "@material-ui/icons/CropFree";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// import SettingsIcon from "@material-ui/icons/Settings";
import { useTranslation } from "react-i18next";
import styles from "./alarm-history-modal.style.module.css";

export const AlarmHistoryModal = ({
  visible = false,
  onClose = () => {},
  children,
}) => {
  const { t } = useTranslation();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        if (buttonRef?.current) {
          buttonRef?.current?.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <Box className={styles.container}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={styles.header}
      >
        <p className={styles.mainTitle}>{t("dock:alarm-history.title")}</p>

        <Box display="flex">
          {/* <IconButton onClick={onClickSettings}>
            <SettingsIcon />
          </IconButton> */}

          <IconButton onClick={onClose} ref={buttonRef} disableRipple>
            <CropFreeIcon />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.main}>{children}</Box>
    </Box>,
    document.getElementById("alarm-history-modal"),
  );
};
