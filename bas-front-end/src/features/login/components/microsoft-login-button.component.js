import { Box } from "@material-ui/core";
import microsoft from "assets/images/microsoft.svg";
import { useTranslation } from "react-i18next";
import classes from "./microsoft-login-button.style.module.css";

export const MicrosoftLoginButton = ({ onClick = () => {} }) => {
  const { t } = useTranslation();

  return (
    <Box className={classes.container} onClick={onClick}>
      <Box className={classes.leftPart}>
        <img src={microsoft} alt="Microsoft" className={classes.leftPartIcon} />
      </Box>

      <Box className={classes.rightPart}>
        {t("common:button.sign-in-with-microsoft")}
      </Box>
    </Box>
  );
};
