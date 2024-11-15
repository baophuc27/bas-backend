import { Avatar, Box, Menu, MenuItem } from "@material-ui/core";
import { FolderOutlined } from "@material-ui/icons";
import { getRoleLabel } from "common/constants/role.constant";
import { AuthService } from "common/services";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "redux/slices/user.slice";
import { LogOut } from "../icons";
import styles from "./profile-information.style.module.css";

export const ProfileInformation = (props) => {
  const { auth } = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refreshToken } = useSelector((state) => state?.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuWidth, setMenuWidth] = useState(0);

  const onClickMenu = (event) => setAnchorEl(event.currentTarget);

  const onClose = () => setAnchorEl(null);

  const onShowDashboard = () => navigate("/dashboard");

  const onLogOut = async () => {
    AuthService.logOut(refreshToken);

    dispatch(logOut());

    navigate("/auth/login");

    onClose();
  };

  useEffect(() => {
    if (anchorEl) {
      setMenuWidth(anchorEl.clientWidth);
    }
  }, [anchorEl]);

  return (
    <Box style={{ position: "relative" }}>
      <Box className={styles.container} onClick={onClickMenu}>
        <Avatar alt="Avatar" className={styles.avatar} />

        <Box>
          <Box className={styles.username}>{auth?.auth?.fullName}</Box>
          <Box className={styles.userRole}>{getRoleLabel(t, auth?.roleId)}</Box>
        </Box>
      </Box>

      <Menu
        id="homeMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          style: {
            width: menuWidth,
            marginLeft: 16,
          },
        }}
        MenuListProps={{
          style: {
            width: "100%",
          },
        }}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={onShowDashboard} className={styles.menuItem}>
          <div className={styles.icon}>
            <FolderOutlined />
          </div>
          {t("common:button.management")}
        </MenuItem>
        <MenuItem onClick={onLogOut} className={styles.menuItem}>
          <div className={styles.icon}>
            <LogOut />
          </div>
          {t("common:button.log-out")}
        </MenuItem>
      </Menu>
    </Box>
  );
};
