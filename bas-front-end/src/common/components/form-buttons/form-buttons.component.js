import { Box, Button, CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const FormButtons = (props) => {
  const {
    formik,
    cancelLink,
    loading,
    onlyCancel = false,
    cancelText,
    saveText,
    isValid,
  } = props;
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="flex-end" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        {!onlyCancel && (
          <Button
            className="custom-button"
            disabled={
              loading ||
              formik.isSubmitting ||
              (!isValid && isValid !== undefined
                ? true
                : !formik.isValid && !isValid)
            }
            onClick={formik.handleSubmit}
          >
            {saveText || t("common:button.save")}
            {(loading || formik.isSubmitting) && (
              <CircularProgress
                color="inherit"
                size={16}
                style={{ marginLeft: "5px" }}
              />
            )}
          </Button>
        )}

        {cancelLink && (
          <Box ml={onlyCancel ? 0 : 3}>
            <Link to={cancelLink}>
              <Button className="custom-button light-button" type="button">
                {cancelText || t("common:button.cancel")}
              </Button>
            </Link>
          </Box>
        )}
      </Box>

      {!onlyCancel && (
        <Box className="note-msg">* {t("common:note.required-field")}</Box>
      )}
    </Box>
  );
};
