import { useAppForm } from "common/hooks";

export const useLogin = ({ t }) => {
  const fieldList = [
    {
      name: "email",
      label: t("login:label.account"),
      fieldType: "input",
      validationType: "string",
      placeholder: t("login:placeholder.account"),
      required: true,
    },
    {
      name: "password",
      label: t("login:label.password"),
      type: "password",
      fieldType: "input",
      validationType: "string",
      isPasswordField: true,
      required: true,
      placeholder: t("login:placeholder.password"),
    },
  ];

  const onSubmit = () => {};

  const { formik, loading } = useAppForm({ fieldList, onSubmit });

  return {
    formik,
    loading,
    fieldList,
    onSubmit,
  };
};
