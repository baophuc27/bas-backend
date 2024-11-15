import { useTranslation } from "react-i18next";
import classes from "./divider.style.module.css";

export const Divider = (props) => {
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <span className={classes.text}>{t("common:or")}</span>
      <div className={classes.line}></div>
    </div>
  );
};
