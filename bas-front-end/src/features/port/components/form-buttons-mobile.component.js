import { Button, CircularProgress, Grid } from "@material-ui/core";
import LockReset from "@material-ui/icons/VpnKeyOutlined";
import { useTranslation } from "react-i18next";
import classes from "./form-buttons-mobile.style.module.css";

export const MobileFormButtons = (props) => {
  const { formik, loading, toggleModal } = props;
  const { t } = useTranslation();

  return (
    <div className={classes.mobileButtons}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Button
            className="custom-button"
            type="submit"
            disabled={loading || formik.isSubmitting || !formik.isValid}
            fullWidth
            onClick={formik.handleSubmit}
          >
            {t("common:button.save")}

            {(loading || formik.isSubmitting) && (
              <CircularProgress
                color="inherit"
                size={16}
                style={{ marginLeft: "5px" }}
              />
            )}
          </Button>
        </Grid>

        <Button
          className="custom-button light-button"
          style={{ marginLeft: 6, marginRight: 6, width: "100%" }}
          type="button"
          onClick={toggleModal}
        >
          <LockReset style={{ fontSize: "20px", marginRight: "8px" }} />
          {t("account-info:button.reset-password")}
        </Button>
      </Grid>
    </div>
  );
};
