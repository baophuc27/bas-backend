import { createYupSchema } from "common/utils";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

export const useAppForm = ({ fieldList, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const initialValues = {};
  fieldList.forEach((item) => {
    initialValues[item.name] = item.initialValue;
  });
  const formSchema = fieldList.reduce(createYupSchema, {});
  const validationSchema = yup.object().shape(formSchema);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      onSubmit(values, { ...actions, setLoading });
    },
  });

  return { formik, loading };
};
