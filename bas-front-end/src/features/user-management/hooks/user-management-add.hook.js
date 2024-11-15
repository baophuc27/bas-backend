import { phoneRegExp } from "common/constants/regex.constant";
import { UserManagementService } from "common/services";
import { notify } from "common/utils/dashboard-toast.util";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../constant/user-management.constant";
import { AddAccountSchema } from "../schemas/add-account.schema";

const USER_ROLE_ID = 3;

export const useUserCreate = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAvailableAccounts = async () => {
    try {
      const resp = await UserManagementService.getAllAvailableAccounts();

      if (resp?.data?.success) {
        setAvailableAccounts(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllRoles = async () => {
    try {
      const resp = await UserManagementService.getAllRoles();

      if (resp?.data?.success) {
        setRoles(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getErrorMessageFromCode = (t, code) => {
    switch (code) {
      case "DUPLICATE_EMAIL":
        return t("user-management:messages.duplicated-email");

      case "DUPLICATE_PHONE":
        return t("user-management:messages.duplicated-phone");

      case "DUPLICATE_USERNAME":
        return t("user-management:messages.duplicated-username");

      default:
        return "";
    }
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      setLoading(true);

      const postData = {
        azureId: values?.azureId,
        roleId: values?.roleId,
        email: values?.email || null,
        phone: values?.phone || null,
        fullName: values?.fullName,
        useManualAccount:
          values?.useManualAccount === ACCOUNT_TYPE.MANUAL ? true : false,
        password: values?.password,
        username: values?.username,
      };

      if (postData.useManualAccount) {
        delete postData.azureId;
      } else {
        delete postData.username;
        delete postData.password;
      }

      const resp = await UserManagementService.create(postData);

      if (resp?.data?.success) {
        notify("success", t("user-management:messages.add_success"));

        navigate("/dashboard/users");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);

      let internalCodes = error?.response?.data?.internalCode;

      if (!Array.isArray(internalCodes)) {
        internalCodes = [error?.response?.data?.internalCode];
      }

      if (internalCodes?.length > 0) {
        for (let internalCode of internalCodes) {
          const errorMessage = getErrorMessageFromCode(t, internalCode);

          if (errorMessage !== "") {
            notify("error", errorMessage);
          }
        }
      } else {
        notify("error", t("user-management:messages.add_failed"));
      }
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const formik = useFormik({
    validationSchema: AddAccountSchema(t),
    initialValues: {
      roleId: USER_ROLE_ID,
      useManualAccount: ACCOUNT_TYPE.MANUAL,
    },
    enableReinitialize: true,
    onSubmit,
  });

  const fieldList = [
    {
      name: "useManualAccount",
      label: t("user-management:account-type"),
      fieldType: "radio",
      placeholder: t("user-management:placeholder.account"),
      initialValue: ACCOUNT_TYPE.MANUAL,
      validationType: "string",
      required: true,
      options: [
        {
          id: ACCOUNT_TYPE.MANUAL,
          value: ACCOUNT_TYPE.MANUAL,
          label: t("user-management:account-option.manual"),
        },
        {
          id: ACCOUNT_TYPE.AD_ACCOUNT,
          value: ACCOUNT_TYPE.AD_ACCOUNT,
          label: t("user-management:account-option.ad-account"),
        },
      ],
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "azureId",
      label: t("user-management:account"),
      fieldType: "select",
      placeholder: t("user-management:placeholder.account"),
      initialValue: "",
      validationType: "string",
      required: formik?.values?.useManualAccount === ACCOUNT_TYPE.AD_ACCOUNT,
      notRender: formik?.values?.useManualAccount !== ACCOUNT_TYPE.AD_ACCOUNT,
      options: availableAccounts?.map((account) => ({
        id: account?.azureId,
        value: account?.azureId,
        label: account?.userPrincipalName,
      })),
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "username",
      label: t("user-management:username"),
      placeholder: t("user-management:placeholder.username"),
      initialValue: "",
      validationType: "string",
      required: formik?.values?.useManualAccount === ACCOUNT_TYPE.MANUAL,
      notRender: formik?.values.useManualAccount !== ACCOUNT_TYPE.MANUAL,
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "password",
      label: t("user-management:password"),
      placeholder: t("user-management:placeholder.password"),
      initialValue: "",
      validationType: "string",
      type: "password",
      isPasswordField: true,
      required: formik?.values?.useManualAccount === ACCOUNT_TYPE.MANUAL,
      notRender: formik?.values.useManualAccount !== ACCOUNT_TYPE.MANUAL,
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "fullName",
      label: t("user-management:full-name"),
      initialValue: null,
      required: true,
      placeholder: t("user-management:placeholder.full-name"),
      fieldType: "text",
      validationType: "string",
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "email",
      label: "Email",
      initialValue: null,
      fieldType: "text",
      placeholder: t("user-management:placeholder.email"),
      validationType: "string",
      validations: [
        {
          type: "nullable",
          params: [],
        },
        {
          type: "email",
          params: [t("account-info:messages.email")],
        },
      ],
    },
    {
      name: "phone",
      label: t("user-management:phone-number"),
      placeholder: t("user-management:placeholder.phone-number"),
      initialValue: "",
      fieldType: "text",
      validationType: "string",
      validations: [
        {
          type: "nullable",
          params: [],
        },
        {
          type: "matches",
          params: [phoneRegExp, t("account-info:messages.phone-number")],
        },
      ],
    },
    {
      name: "roleId",
      label: t("user-management:permission"),
      placeholder: t("user-management:placeholder.permission"),
      initialValue: USER_ROLE_ID,
      required: true,
      fieldType: "select",
      options: roles?.map((role) => ({
        id: role?.id,
        value: role?.id,
        label:
          role?.[["en", "en-US"].includes(i18n.language) ? "nameEn" : "nameVi"],
      })),
      validationType: "string",
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
  ];

  useEffect(() => {
    if (availableAccounts?.length && formik.values?.azureId) {
      const account = availableAccounts.find(
        (account) => account.azureId === formik.values?.azureId
      );

      formik.setFieldValue("email", account.email);
      formik.setFieldValue("fullName", account.fullName);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values?.azureId, availableAccounts]);

  return {
    fieldList,
    formik,
    loading,
    availableAccounts,

    onSubmit,
    fetchAllAvailableAccounts,
    fetchAllRoles,
  };
};
