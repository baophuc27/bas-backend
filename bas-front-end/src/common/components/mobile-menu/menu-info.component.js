import { Box } from "@material-ui/core";
import { useSelector } from "react-redux";
import defaultAvatar from "assets/images/user.png";
import classes from "./menu-info.style.module.css";

export const MenuInfo = () => {
  const { auth } = useSelector((state) => state?.user);

  return (
    <Box className={classes.profile}>
      {auth?.auth?.avatar ? (
        <img src={auth?.auth?.avatar} alt="Avatar" className={classes.avatar} />
      ) : (
        <img src={defaultAvatar} alt="Avatar" className={classes.emptyAvatar} />
      )}
      <Box>
        <p className={classes?.username}>{auth?.auth?.fullName}</p>
        <p className={classes?.email}>{auth?.auth?.email}</p>
      </Box>
    </Box>
  );
};
