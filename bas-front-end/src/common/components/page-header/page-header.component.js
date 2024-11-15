import Box from "@material-ui/core/Box";
import { useMediaPredicate } from "react-media-hook";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "../index";
import classes from "./page-header.style.module.css";

export const PageHeader = ({ rightComponent, logoRedirectUrl = "#" }) => {
  const isWideEnough = useMediaPredicate("(min-width: 1300px)");

  const { name_en: nameEn, logo_url: logoUrl } = useSelector(
    (state) => state?.organization,
  );

  return (
    <div className={classes.container}>
      <Box display="flex" alignItems="center">
        <Box className={classes.logo}>
          <Link to={logoRedirectUrl}>
            <img src={logoUrl} alt="logo" />
          </Link>
        </Box>

        {isWideEnough && <Box className={classes.pageTitle}>{nameEn}</Box>}
      </Box>

      <Box display="flex" alignItems="center">
        <LanguageSwitcher />

        {rightComponent}
      </Box>
    </div>
  );
};
