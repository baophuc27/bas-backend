import { useCallback } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const BreadcrumbsList = (props) => {
  const { t } = useTranslation();
  const { featureBreadcrumbs, pageBreadcrumbs } = useSelector(
    (state) => state?.pageConfig
  );

  const prefixBreadcrumbs = useCallback(() => {
    let breadcrumbs = [];

    if (pageBreadcrumbs?.parent && pageBreadcrumbs?.parent?.length > 0) {
      pageBreadcrumbs?.parent?.forEach((pageBreadcrumbId) => {
        breadcrumbs.push(featureBreadcrumbs?.[pageBreadcrumbId]);
      });
    }

    return breadcrumbs;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureBreadcrumbs]);

  if (prefixBreadcrumbs()?.length < 1) {
    return null;
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {prefixBreadcrumbs()?.map((breadcrumb) => (
        <Link color="inherit" href="/" key={breadcrumb?.id}>
          {t(breadcrumb?.titleId)}
        </Link>
      ))}

      <Typography color="textPrimary">{t(pageBreadcrumbs?.titleId)}</Typography>
    </Breadcrumbs>
  );
};
