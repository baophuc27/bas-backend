import { Box, Button, CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export const FormButtons = (props) => {
  const {
    formik,
    loading,
    handleResetForm = () => {},
    showsCancel = true,
  } = props;
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="center" width="100%">
      <Button
        className="custom-button"
        type="submit"
        disabled={loading || formik.isSubmitting || !formik.isValid}
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

      {showsCancel && (
        <Box ml={3}>
          <Button
            className="custom-button light-button"
            type="button"
            onClick={handleResetForm}
          >
            {t("common:button.cancel")}
          </Button>
        </Box>
      )}
    </Box>
  );
};
