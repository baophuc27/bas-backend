import { passwordRegExp, phoneRegExp, usernameRegExp, } from "common/constants/regex.constant";
import * as Yup from "yup";
import { ACCOUNT_TYPE } from "../constant/user-management.constant";

export const AddAccountSchema = (t) =>
  Yup.object().shape({
    azureId: Yup.string()
      .nullable(true)
      .when("useManualAccount", {
        is: (value) => value === ACCOUNT_TYPE.AD_ACCOUNT,
        then: () =>
          Yup.string()
            .nullable(false)
            .required(t("common:note.required-field")),
      }),
    username: Yup.string()
      .nullable(true)
      .when("useManualAccount", {
        is: (value) => value === ACCOUNT_TYPE.MANUAL,
        then: () =>
          Yup.string()
            .nullable(false)
            .matches(usernameRegExp, t("user-management:messages.invalid_username"))
            .required(t("common:note.required-field")),
          }),
          password: Yup.string()
          .nullable(true)
          .when("useManualAccount", {
            is: (value) => value === ACCOUNT_TYPE.MANUAL,
            then: () =>
            Yup.string()
            .nullable(false)
            .matches(passwordRegExp, t("user-management:messages.invalid_password"))
            .required(t("common:note.required-field")),
      }),
    fullName: Yup.string().required(t("common:note.required-field")),
    email: Yup.string().nullable(true).email(t("account-info:messages.email")),
    phone: Yup.string()
      .nullable(true)
      .matches(phoneRegExp, t("account-info:messages.phone-number")),
    roleId: Yup.string().required(t("common:note.required-field")),
    userId: Yup.string(),
  });
