import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import classes from "./login-button.style.module.css";

const useStyles = makeStyles({
  disabled: {
    opacity: 0.6,
    color: "#fff!important",
  },
});

export const LoginButton = ({ loading, formik, t, onClick = () => {} }) => {
  const styles = useStyles();

  return (
    <>
      <Button
        className={classes.loginButton}
        type="submit"
        disabled={loading || formik.isSubmitting || !formik.isValid}
        classes={{
          disabled: styles.disabled,
        }}
        onClick={onClick}
      >
        {t("login:title")}
        {(loading || formik.isSubmitting) && (
          <CircularProgress
            color="primary"
            size={16}
            style={{ marginLeft: "5px" }}
          />
        )}
      </Button>
    </>
  );
};
