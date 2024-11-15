import { Avatar, Box } from "@material-ui/core";
import {
  BERTH_STATUS,
  BERTH_STATUS_COLOR,
} from "common/constants/berth.constant";
import { FEATURES } from "common/constants/feature.constant";
import { ACTIONS } from "common/constants/permission.constant";
import { usePermission } from "common/hooks";
import { notify } from "common/utils";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18n from "setup/i18n";
import styles from "./berth-card.style.module.css";

export const BerthCard = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const onClick = () => {
    const destinationUrl = `/docks/${data?.id}`;

    if (data?.status?.id === BERTH_STATUS.AVAILABLE) {
      if (!hasPermission(FEATURES.BERTH_DASHBOARD, ACTIONS.EDIT)) {
        notify("error", t("port-dashboard:messages.not-configured-berth"));
      } else {
        navigate(destinationUrl);
      }
    } else {
      navigate(destinationUrl);
    }
  };

  return (
    <Box onClick={onClick} className={styles.container}>
      <Avatar
        src="/images/icons/ship.png"
        className={styles.shipIcon}
        alt={data?.nameEn}
      />

      <Box className={styles.details}>
        <Box
          className={styles.status}
          style={{
            background: BERTH_STATUS_COLOR[data?.status?.id],
          }}
        >
          {i18next.language.includes("en")
            ? data?.status?.nameEn
            : data?.status?.name}
        </Box>

        <Box className={styles.shipName}>
          {i18n.language.includes("en") ? data?.name : data?.name}
        </Box>

        {data?.currentVessel?.nameEn && (
          <Box className={styles.name}>{data?.currentVessel?.nameEn}</Box>
        )}
      </Box>
    </Box>
  );
};
