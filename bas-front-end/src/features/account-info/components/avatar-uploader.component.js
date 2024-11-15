import { Box, Button } from "@material-ui/core";
import { DesktopView, MobileView } from "common/components";
import { useTranslation } from "react-i18next";

export const AvatarUploader = ({ pageData }) => {
  const { t } = useTranslation();

  return (
    <Box mt={2} width="100%">
      <input
        type="file"
        accept="image/png, image/jpg, image/jpeg, image/webp"
        id="avatar"
        name="avatar"
        hidden
        onChange={pageData?.handleLogoChange}
        onClick={(event) => {
          event.target.value = null;
        }}
      />
      <DesktopView>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gridColumnGap={16}>
          <label
            htmlFor="avatar"
            className="custom-button light-button custom-upload"
            style={{
              cursor: "pointer",
              padding: "10px 6px",
              textAlign: "center",
            }}
          >
            {t("account-info:button.upload")}
          </label>
          <Button
            className="custom-button light-button custom-upload"
            type="button"
            onClick={pageData?.handleImageCancel}
          >
            {t("common:button.cancel")}
          </Button>
        </Box>
      </DesktopView>
      <MobileView>
        <label
          htmlFor="avatar"
          className="custom-button light-button custom-upload"
          style={{
            cursor: "pointer",
            padding: "10px 6px",
            textAlign: "center",
            display: "block",
          }}
        >
          {t("account-info:button.upload")}
        </label>
      </MobileView>
    </Box>
  );
};
