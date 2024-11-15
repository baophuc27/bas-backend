import { Box, Button, CircularProgress } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import classes from "./modal-buttons.style.module.css";

export const ModalButtons = ({
  onOk,
  onCancel,
  loading,
  cancelText,
  saveText,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="flex-end" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        {onOk && (
          <Button
            className={`custom-button ${classes.saveButton}`}
            disabled={loading || disabled}
            onClick={onOk}
            type="submit"
          >
            {saveText || t("common:button.save")}
            {loading && (
              <CircularProgress
                color="inherit"
                size={16}
                style={{ marginLeft: "5px" }}
              />
            )}
          </Button>
        )}
        {onCancel && (
          <Box ml={3}>
            <Button
              className={`custom-button light-button ${classes.cancelButton}`}
              onClick={onCancel}
            >
              {cancelText || t("common:button.cancel")}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
