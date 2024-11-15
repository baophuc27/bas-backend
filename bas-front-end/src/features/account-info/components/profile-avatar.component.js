import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Avatar, AvatarUploader } from "features/account-info/components";
import { useTranslation } from "react-i18next";
import classes from "./profile-avatar.style.module.css";

export const ProfileAvatar = ({ pageData, loading }) => {
  const { t } = useTranslation();

  if (loading) return <Skeleton height={350} />;

  return (
    <Box>
      <Box className="form-label">{t("account-info:label.avatar")}</Box>

      <Avatar pageData={pageData} />
      {pageData?.isAvatarValid !== true && (
        <p className={classes.message}>
          {t(`account-info:messages.${pageData?.isAvatarValid}`)}
        </p>
      )}
      <p className={classes.label}>{t("account-info:label.avatar-validate")}</p>
      <AvatarUploader pageData={pageData} />
    </Box>
  );
};
