import { Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import alert from "assets/images/alert.svg";
import offline from "assets/images/offline.svg";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useMediaPredicate } from "react-media-hook";
import classes from "./map-modal.style.module.css";

const baseButtonStyle = {
  fontWeight: 400,
  textTransform: "none",
  boxShadow: "none",
  fontSize: "1rem",
  minWidth: 130,
  "&:hover": {
    boxShadow: "none",
  },
};

const useStyles = makeStyles((theme) => ({
  alertPrimaryButton: {
    ...baseButtonStyle,
    backgroundColor: "#EA3636",
    color: "white",
    "&:hover": {
      ...baseButtonStyle?.["&:hover"],
      backgroundColor: "#c30d0d",
    },
  },
  alertSecondaryButton: {
    ...baseButtonStyle,
    marginRight: 42,
    backgroundColor: "#FFDFDF",
    color: "#EA3636",
    "&:hover": {
      ...baseButtonStyle?.["&:hover"],
      backgroundColor: "#F3C4C4",
    },
  },
  offlinePrimaryButton: {
    ...baseButtonStyle,
    backgroundColor: "#82686B",
    color: "white",
    "&:hover": {
      ...baseButtonStyle?.["&:hover"],
      backgroundColor: "#5B4C4F",
    },
  },
  offlineSecondaryButton: {
    ...baseButtonStyle,
    marginRight: 42,
    backgroundColor: "#E4DADB",
    color: "#82686B",
    "&:hover": {
      ...baseButtonStyle?.["&:hover"],
      backgroundColor: "#C5BDBD",
    },
  },
}));

export const MapModal = ({
  type = "",
  visible = false,
  onCancel = () => {},
  onOk = () => {},
  data,
}) => {
  const isMobile = useMediaPredicate("(max-width: 991px)");

  const { t } = useTranslation();
  const muiClasses = useStyles();

  if (!visible) {
    return null;
  }

  if (type === "") {
    return null;
  }

  return createPortal(
    <>
      <Box className={classes.modalShadow} onClick={onOk}>
        <Box
          className={`${classes.modal} ${classes?.[type]} ${
            isMobile ? classes.mobileModal : ""
          }`}
        >
          {type === "alert" && (
            <img src={alert} alt="Alert" className={classes.modalIcon} />
          )}
          {type === "offline" && (
            <img src={offline} alt="Offline" className={classes.modalIcon} />
          )}

          <h3 className={classes.modalTitle}>{t(`map:${type}-modal.title`)}</h3>
          <p className={classes.modalDescription}>
            {t(`map:${type}-modal.description`, {
              buoyName: data?.buoyName,
              deviceName: data?.deviceName,
            })}
          </p>

          <Box
            className={`${classes.modalFooter} ${
              isMobile ? classes.mobileModalFooter : ""
            }`}
          >
            <Button
              variant="contained"
              className={muiClasses?.[`${type}SecondaryButton`]}
              onClick={() => onCancel(data?.deviceId)}
            >
              {t("map:alert-modal.button.understood")}
            </Button>

            <Button
              variant="contained"
              className={muiClasses?.[`${type}PrimaryButton`]}
              onClick={onOk}
            >
              {t("map:alert-modal.button.repeat")}
            </Button>
          </Box>
        </Box>
      </Box>
    </>,
    document.getElementById("map-modal")
  );
};
