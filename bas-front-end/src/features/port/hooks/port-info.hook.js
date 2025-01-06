import { urlRegExp } from "common/constants/regex.constant";
import { useAppForm } from "common/hooks";
import { HabourService } from "common/services";
import { notify } from "common/utils/dashboard-toast.util";
import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { setOrganizationData } from "redux/slices/organization.slice";

export const usePortInfo = (t) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const dispatch = useDispatch();
  const fieldList = [
    {
      name: "name",
      label: t("port-info:label.name"),
      fieldType: "text",
      initialValue: data?.name,
      validationType: "string",
      placeholder: t("port-info:placeholder.name"),
      required: true,
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "nameEn",
      label: t("port-info:label.english-name"),
      fieldType: "text",
      initialValue: data?.nameEn,
      validationType: "string",
      placeholder: t("port-info:placeholder.english-name"),
      required: true,
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "address",
      label: t("port-info:label.address"),
      fieldType: "text",
      initialValue: data?.address,
      validationType: "string",
      placeholder: t("port-info:placeholder.address"),
      required: true,
      validations: [
        {
          type: "required",
          params: [t("common:note.required-field")],
        },
      ],
    },
    {
      name: "description",
      label: t("port-info:label.description"),
      fieldType: "text",
      initialValue: data?.description,
      validationType: "string",
      placeholder: t("port-info:placeholder.description"),
      multiline: true,
      rows: 5,
    },
    {
      name: "weatherWidgetDashboardUrl",
      label: t("port-info:label.weather-widget-dashboard-url"),
      fieldType: "text",
      initialValue: data?.weatherWidgetDashboardUrl,
      validationType: "string",
      placeholder: t("port-info:placeholder.weather-widget-dashboard-url"),
      // required: true,
      // validations: [
      //   {
      //     type: "required",
      //     params: [t("common:note.required-field")],
      //   },
      //   {
      //     type: "matches",
      //     params: [urlRegExp, t("port-info:messages.invalid-url")],
      //   },
      // ],
    },
    {
      name: "weatherWidgetUrl",
      label: t("port-info:label.weather-widget-url"),
      fieldType: "text",
      initialValue: data?.weatherWidgetUrl,
      validationType: "string",
      placeholder: t("port-info:placeholder.weather-widget-url"),
      // required: true,
      // validations: [
      //   {
      //     type: "required",
      //     params: [t("common:note.required-field")],
      //   },
      //   {
      //     type: "matches",
      //     params: [urlRegExp, t("port-info:messages.invalid-url")],
      //   },
      // ],
    },
  ];

  const getErrorMessageFromCode = (t, code) => {
    switch (code) {
      default:
        return "";
    }
  };

  const onSubmit = async (values, { setSubmitting, setLoading }) => {
    try {
      setSubmitting(true);
      setLoading(true);

      const postData = {
        name: values?.name?.trim() || null,
        nameEn: values?.nameEn?.trim() || null,
        address: values?.address?.trim() || null,
        description: values?.description?.trim() || null,
        weatherWidgetDashboardUrl:
          values?.weatherWidgetDashboardUrl?.trim() || null,
        weatherWidgetUrl: values?.weatherWidgetUrl?.trim() || null,
      };

      const resp = await HabourService.update(postData);

      if (resp?.data?.success) {
        // dispatch(setOrganizationData(resp?.data?.data));

        notify("success", t("port-info:dialog.success-message"));
      } else {
        notify("error", t("port-info:dialog.failed-message"));
        throw new Error(resp?.data?.message);
      }
    } catch (error) {
      notify("error", t("port-info:dialog.failed-message"));
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const { formik, loading } = useAppForm({ fieldList, onSubmit });

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const resp = await HabourService.getData();

      if (resp?.data?.success) {
        setData(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    formik.setFieldValue("name", data?.name);
    formik.setFieldValue("nameEn", data?.nameEn);
    formik.setFieldValue("address", data?.address);
    formik.setFieldValue("description", data?.description);
    formik.setFieldValue(
      "weatherWidgetDashboardUrl",
      data?.weatherWidgetDashboardUrl,
    );
    formik.setFieldValue("weatherWidgetUrl", data?.weatherWidgetUrl);
  };

  return {
    formik,
    loading,
    fieldList,
    data,
    isLoading,
    setData,
    onSubmit,
    fetchData,
    handleResetForm,
  };
};
