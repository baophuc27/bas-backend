import { Button, CircularProgress } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { FormGroup } from "common/components";
import { passwordRegExp } from "common/constants/regex.constant";
import { useAppForm } from "common/hooks";
import { AuthService } from "common/services";
import { notify } from "common/utils";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import classes from "./change-password-modal.style.module.css";

export const ChangePasswordModal = ({ visible = false }) => {
  const { t } = useTranslation();
  const fieldList = [
    {
      name: "password",
      label: t("user-management:new-password"),
      initialValue: "",
      type: "password",
      fieldType: "input",
      validationType: "string",
      isPasswordField: true,
      required: true,
      placeholder: t("user-management:placeholder.new-password"),
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
        {
          type: "matches",
          params: [
            passwordRegExp,
            t("user-management:messages.invalid_password"),
          ],
        },
      ],
    },
    {
      name: "confirmPassword",
      label: t("user-management:confirm-password"),
      initialValue: "",
      type: "password",
      fieldType: "input",
      validationType: "string",
      isPasswordField: true,
      required: true,
      placeholder: t("user-management:placeholder.confirm-password"),
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
        {
          type: "oneOf",
          params: [
            [Yup.ref("password"), null],
            t("user-management:messages.password_not_match"),
          ],
        },
      ],
    },
  ];

  const onSubmit = async (values, { setLoading }) => {
    try {
      setLoading(true);

      const { password } = values;
      const resp = await AuthService.updateMyPassword(password);

      if (resp?.data?.success) {
        notify(
          "success",
          t("user-management:messages.change_password_success")
        );
        window.location.replace("/");
      }
    } catch (error) {
      notify("error", t("user-management:messages.change_password_failed"));
    } finally {
      setLoading(false);
    }
  };

  const { formik, loading } = useAppForm({
    fieldList,
    onSubmit,
  });

  return (
    <Modal
      open={visible}
      aria-labelledby={`change-password-modal`}
      aria-describedby={`change-password-modal`}
      // style={{ zIndex: 9999 }}
    >
      <div className={classes.container}>
        <div className={classes.header}>
          <h3 className={classes.title}>
            {t("user-management:change-password")}
          </h3>
        </div>
        <div className={classes.subHeader}>
          <i>{t("user-management:messages.new_change_password")}</i>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <FormGroup items={fieldList} formik={formik} />

          <Button
            className={`custom-button ${classes.saveButton}`}
            disabled={loading || !formik.isValid}
            onClick={() => formik.handleSubmit()}
          >
            {t("common:button.save")}
            {loading && (
              <CircularProgress
                color="inherit"
                size={16}
                style={{ marginLeft: "5px" }}
              />
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
