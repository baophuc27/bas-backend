import { Box } from "@material-ui/core";
import DefaultAvatar from "assets/images/user.png";
import classes from "./avatar.style.module.css";

export const Avatar = ({ pageData }) => {
  return (
    <Box
      className={
        classes.avatarImageWrapper +
        " " +
        (pageData?.isAvatarValid === true ? "" : classes.invalid)
      }
    >
      {!pageData?.avatar ? (
        <img src={DefaultAvatar} alt="Avatar" className="image-uploader-icon" />
      ) : (
        <img
          src={pageData?.avatar}
          alt="Avatar"
          className="image-uploader-image"
        />
      )}
    </Box>
  );
};
