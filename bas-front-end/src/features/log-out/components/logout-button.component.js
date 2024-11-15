import { Button, makeStyles } from "@material-ui/core";
import classes from "./style.module.css";

const useStyles = makeStyles({
  disabled: {
    opacity: 0.6,
    color: "#fff!important",
  },
});

export const LogoutButton = ({ t, onClick = () => {} }) => {
  const styles = useStyles();
  return (
    <>
      <Button
        className={`custom-button full-width ${classes.logoutButton}`}
        type="submit"
        classes={{
          disabled: styles.disabled,
        }}
        onClick={onClick}
      >
        {t("logout:title")}
      </Button>
    </>
  );
};
