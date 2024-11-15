import Modal from "@material-ui/core/Modal";
import { FormGroup, ModalButtons } from "common/components";
import { useTranslation } from "react-i18next";
import classes from "./reset-password-modal.style.module.css";

export const ResetPasswordModal = ({
  visible = false,
  onOk = () => {},
  onClose = () => {},
  fieldList = [],
  formik = {},
  title,
  subTitle,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={visible}
      onClose={onClose}
      aria-labelledby={`user-management-change-password-modal`}
      aria-describedby={`user-management-change-password-modal`}
      style={{ zIndex: 9999 }}
    >
      <div className={classes.container}>
        <div className={classes.header}>
          <h3 className={classes.title}>{title}</h3>
          <i>{subTitle && <p className={classes.subtile}>{subTitle}</p>}</i>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <FormGroup items={fieldList} formik={formik} />

          <ModalButtons
            onOk={onOk}
            onCancel={onClose}
            saveText={t("common:button.save")}
            cancelText={t("spm-management:button.cancel")}
            loading={loading}
            disabled={formik?.isSubmitting || !formik?.isValid || loading}
          />
        </form>
      </div>
    </Modal>
  );
};
