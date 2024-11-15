import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { MobileLanguageSwitcher, MobileMenu } from "common/components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./search-app-bar.style.module.css";

const useStyles = makeStyles((theme) => ({
  button: {
    width: 42,
    height: 42,
    padding: 6,
    margin: 0,
  },
}));

export const SearchAppBar = ({
  title,
  keyword,
  onChange = () => {},
  onClose = () => {},
}) => {
  const muiClasses = useStyles();
  const { t } = useTranslation();
  const [showsMobileMenu, setShowsMobileMenu] = useState(false);
  const [showsSearchBox, setShowsSearchBox] = useState(false);

  const toggleMobileMenu = () => setShowsMobileMenu((prev) => !prev);

  const toggleSearchBox = () => {
    setShowsSearchBox((prev) => !prev);
    onClose();
  };

  return (
    <div className={classes.container}>
      {showsSearchBox && (
        <div className={classes.searchBox}>
          <input
            className={classes.searchInput}
            placeholder={t("common:placeholder.enter-keyword")}
            value={keyword}
            onChange={onChange}
          />

          <IconButton
            className={muiClasses.button}
            style={{ marginLeft: 6 }}
            onClick={toggleSearchBox}
            disableRipple
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}

      {!showsSearchBox && (
        <div className={classes.header}>
          <IconButton
            className={muiClasses.button}
            style={{ marginRight: 6 }}
            onClick={toggleMobileMenu}
            disableRipple
          >
            <MenuIcon />
          </IconButton>

          <span className={classes.title}>{title}</span>

          <IconButton
            className={muiClasses.button}
            style={{ marginRight: 6 }}
            onClick={toggleSearchBox}
            disableRipple
          >
            <SearchIcon />
          </IconButton>

          <MobileLanguageSwitcher />
        </div>
      )}

      <SwipeableDrawer
        anchor="left"
        open={showsMobileMenu}
        onClose={toggleMobileMenu}
      >
        <MobileMenu />
      </SwipeableDrawer>
    </div>
  );
};
