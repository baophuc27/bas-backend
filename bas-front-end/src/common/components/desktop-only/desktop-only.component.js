import { Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export const DesktopOnly = () => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="92vh"
      bgcolor="#F5F5F5"
    >
      <p style={{ color: "#9C9C9C" }}>{t("common:note.desktop-only")}</p>
    </Box>
  );
};
