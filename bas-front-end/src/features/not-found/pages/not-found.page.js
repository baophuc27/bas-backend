import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import notFoundImage from "../../../assets/images/not-found.svg";
import classes from "./not-found.style.module.css";
import { usePageConfig } from "common/hooks";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hideBreadcrumbs } = usePageConfig();

  useEffect(() => {
    hideBreadcrumbs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <img src={notFoundImage} alt="Page Not Found" className={classes.image} />

      <h2 className={classes.title}>{t("not-found:title")}</h2>
      <p className={classes.message}>{t("not-found:message")}</p>

      <Button className="custom-button" onClick={() => navigate("/")}>
        {t("common:button.go-to-homepage")}
      </Button>
    </div>
  );
};
