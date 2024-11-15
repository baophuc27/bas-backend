import { phoneRegExp } from "common/constants/regex.constant";
import { useAppForm, useLoading, useQuery } from "common/hooks";
import { UserManagementService } from "common/services";
import { notify } from "common/utils/dashboard-toast.util";
import { isEmpty } from "lodash";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ACCOUNT_TYPE } from "../constant/user-management.constant";

export const useUserEdit = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const query = useQuery();
  const [pageLoading, enabledPageLoading, disabledPageLoading] = useLoading();
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState([]);
  const [backUrl, setBackUrl] = useState("");
  const fieldList = [
    {
      name: "useManualAccount",
      label: t("user-management:account-type"),
      fieldType: "radio",
      placeholder: t("user-management:placeholder.account"),
      initialValue: data?.useManualAccount
        ? ACCOUNT_TYPE.MANUAL
        : ACCOUNT_TYPE.AD_ACCOUNT,
      validationType: "string",
      required: true,
      options: [
        {
          id: ACCOUNT_TYPE.MANUAL,
          value: ACCOUNT_TYPE.MANUAL,
          label: t("user-management:account-option.manual"),
          disabled: true,
        },
        {
          id: ACCOUNT_TYPE.AD_ACCOUNT,
          value: ACCOUNT_TYPE.AD_ACCOUNT,
          label: t("user-management:account-option.ad-account"),
          disabled: true,
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
      name: "userAccount",
      label: t("user-management:account"),
      fieldType: "text",
      placeholder: t("user-management:placeholder.account"),
      initialValue: data?.userAccount,
      validationType: "string",
      required: true,
      disabled: true,
      notRender: !data?.useManualAccount,
      validations: [],
    },
    {
      name: "azureId",
      label: t("user-management:account"),
      fieldType: "select",
      placeholder: t("user-management:placeholder.account"),
      initialValue: data?.azureId,
      validationType: "string",
      required: true,
      disabled: true,
      notRender: data?.useManualAccount,
      options: [
        {
          id: data?.azureId,
          value: data?.azureId,
          label: data?.userAccount,
        },
      ],
      validations: [],
    },
    {
      name: "password",
      label: t("user-management:password"),
      placeholder: t("user-management:placeholder.password"),
      initialValue: "••••••••••••••••••••••",
      validationType: "string",
      type: "password",
      disabled: true,
      isPasswordField: true,
      required: data?.useManualAccount,
      notRender: !data?.useManualAccount,
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
      initialValue: data.fullName,
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
      initialValue: data.email,
      placeholder: t("user-management:placeholder.email"),
      fieldType: "text",
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
      initialValue: data?.phone,
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
      initialValue: data?.roleId,
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

  const onSubmit = async (values, { setSubmitting, setLoading }) => {
    try {
      setSubmitting(true);
      setLoading(true);

      const requestData = {
        azureId: values?.azureId,
        roleId: values?.roleId,
        email: values?.email || null,
        phone: values?.phone || null,
        fullName: values?.fullName,
      };

      const resp = await UserManagementService.updateById(id, requestData);

      if (resp?.data?.success) {
        notify("success", t("user-management:messages.edit_success"));

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

  const { formik, loading } = useAppForm({ fieldList, onSubmit });

  const fetchData = async () => {
    enabledPageLoading();

    try {
      const resp = await UserManagementService.getById(id);

      if (resp?.data?.success) {
        setData(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      disabledPageLoading();
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

  useEffect(() => {
    const params = {};
    let url = "/dashboard/users";

    if (query.get("ppi") && +query.get("ppi") > 0) {
      params["ppi"] = +query.get("ppi");
    }

    if (query.get("ps") && +query.get("ps") > 0) {
      params["ps"] = +query.get("ps");
    }

    if (query.get("pageData")) params["pageData"] = query.get("pageData");

    if (!isEmpty(params)) {
      url += `?${queryString.stringify(params)}`;
    }

    setBackUrl(url);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    fieldList,
    formik,
    loading,
    pageLoading,
    roles,
    backUrl,

    setData,
    onSubmit,
    fetchData,
    fetchAllRoles,
  };
};
