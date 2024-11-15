import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BreadcrumbsList } from "./breadcrumbs-list.component";
import classes from "./page-breadcrumbs.style.module.css";

export const PageBreadcrumbs = (props) => {
  const { t } = useTranslation();
  const { titleId, titleParams, showsBreadcrumbs } = useSelector(
    (state) => state?.pageConfig
  );

  if (!showsBreadcrumbs) {
    return null;
  }

  return (
    <div className={classes.container}>
      {/* <Helmet>
        <title>
          {t("common:app.name")} | {t(titleId, titleParams)}
        </title>
      </Helmet> */}

      <h1 className={classes.title}>{t(titleId, titleParams)}</h1>

      <BreadcrumbsList />
    </div>
  );
};
