import { Button, makeStyles } from "@material-ui/core";
import classes from "./style.module.css";

const useStyles = makeStyles({
  disabled: {
    opacity: 0.6,
    color: "#fff!important",
  },
});

export const LoginAnotherAccountButton = ({ t, onClick = () => {} }) => {
  const styles = useStyles();
  return (
    <>
      <Button
        className={`${classes.loginAnother}`}
        type="submit"
        classes={{
          disabled: styles.disabled,
        }}
        onClick={onClick}
      >
        {t("logout:login-another")}
      </Button>
    </>
  );
};
