import Box from "@material-ui/core/Box";
import { useMediaPredicate } from "react-media-hook";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../index";
import classes from "./page-header.style.module.css";

export const PageHeader = ({
  rightComponent,
  logoRedirectUrl = "#",
  hideLogoAndName = false, // Thêm prop mới
}) => {
  const isWideEnough = useMediaPredicate("(min-width: 1300px)");

  const { t, i18n } = useTranslation();

  const {
    name_vi: name,
    name_en: nameEn,
    logo_url: logoUrl,
  } = useSelector((state) => state?.organization);

  const displayName = i18n.language === "vi" ? name : nameEn;

  return (
    <div className={classes.container}>
      <Box display="flex" alignItems="center">
        {!hideLogoAndName && (
          <>
            <Box className={classes.logo}>
              <Link to={logoRedirectUrl}>
                <img src={logoUrl} alt="logo" />
              </Link>
            </Box>

            {isWideEnough && (
              <Box className={classes.pageTitle}>{displayName}</Box>
            )}
          </>
        )}
      </Box>

      <Box display="flex" alignItems="center">
        <LanguageSwitcher />

        {rightComponent}
      </Box>
    </div>
  );
};
