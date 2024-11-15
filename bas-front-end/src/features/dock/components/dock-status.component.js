import { Box } from "@material-ui/core";
import {
  BERTH_STATUS,
  BERTH_STATUS_BORDER_COLOR,
  BERTH_STATUS_COLOR,
} from "common/constants/berth.constant";
import { t } from "i18next";
import { useMemo } from "react";
import styles from "./dock-status.style.module.css";

export const DockStatus = ({ setShowBerthingSetting, statusCode }) => {
  const config = useMemo(() => {
    const config = {
      color: "",
      text: "",
      border: "",
    };
    switch (statusCode) {
      case BERTH_STATUS.AVAILABLE:
        config.color = BERTH_STATUS_COLOR[statusCode];
        config.text = t("berthing:status.available");
        config.border = BERTH_STATUS_BORDER_COLOR[statusCode];
        break;
      case BERTH_STATUS.BERTHING:
        config.color = BERTH_STATUS_COLOR[statusCode];
        config.text = t("berthing:status.berthing");
        config.border = BERTH_STATUS_BORDER_COLOR[statusCode];
        break;
      case BERTH_STATUS.DEPARTING:
        config.color = BERTH_STATUS_COLOR[statusCode];
        config.text = t("berthing:status.departing");
        config.border = BERTH_STATUS_BORDER_COLOR[statusCode];
        break;
      case BERTH_STATUS.MOORING:
        config.color = BERTH_STATUS_COLOR[statusCode];
        config.text = t("berthing:status.mooring");
        config.border = BERTH_STATUS_BORDER_COLOR[statusCode];
        break;
      default:
        break;
    }

    return config;
  }, [statusCode]);

  return (
    <Box top={3}>
      <Box
        className={styles.buttonContainer}
        style={{
          backgroundColor: config.color,
          borderColor: config.border,
        }}
        onClick={() => setShowBerthingSetting(true)}
      >
        <Box>{config.text}</Box>
      </Box>
    </Box>
  );
};
