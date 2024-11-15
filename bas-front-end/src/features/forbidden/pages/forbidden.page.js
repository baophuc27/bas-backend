import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import notFoundImage from "../../../assets/images/forbidden.svg";
import classes from "./forbidden.style.module.css";
import { usePageConfig } from "common/hooks";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

export const ForbiddenPage = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hideBreadcrumbs } = usePageConfig();

  useEffect(() => {
    hideBreadcrumbs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <img src={notFoundImage} alt="Forbidden" className={classes.image} />

      <h2 className={classes.title}>{t("forbidden:title")}</h2>
      <p className={classes.message}>{t("forbidden:message")}</p>

      <Button
        className="custom-button"
        onClick={() => navigate(`/auth/log-out`)}
      >
        {t("common:button.log-out")}
      </Button>
    </div>
  );
};
