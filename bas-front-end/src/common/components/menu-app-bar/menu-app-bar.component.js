import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import MenuIcon from "@material-ui/icons/Menu";
import { MobileMenu } from "common/components";
import { useState } from "react";
import classes from "./menu-app-bar.style.module.css";

const useStyles = makeStyles((theme) => ({
  button: {
    width: 42,
    height: 42,
    padding: 6,
    margin: 0,
  },
}));

export const MenuAppBar = ({ onBack = () => {}, title }) => {
  const muiClasses = useStyles();
  const [showsMobileMenu, setShowsMobileMenu] = useState(false);

  const toggleMobileMenu = () => setShowsMobileMenu((prev) => !prev);

  return (
    <div className={classes.container}>
      <IconButton
        className={muiClasses.button}
        style={{ marginRight: 6 }}
        onClick={toggleMobileMenu}
        disableRipple
      >
        <MenuIcon />
      </IconButton>

      <span className={classes.title}>{title}</span>
      {/* <MobileLanguageSwitcher /> */}
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
