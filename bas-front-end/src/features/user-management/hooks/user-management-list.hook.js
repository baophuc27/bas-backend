import { DATE_TIME_FORMAT } from "common/constants/date-time.constant";
import { passwordRegExp } from "common/constants/regex.constant";
import { useAppForm, useQuery } from "common/hooks";
import { UserManagementService } from "common/services";
import {
  decodePageData,
  deleteSearchParams,
  encodePageData,
  notify,
} from "common/utils";
import { first } from "lodash";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import * as Yup from "yup";

export const useUserList = () => {
  const { t } = useTranslation();
  const query = useQuery();
  const pageFilter = query.get("pageData")
    ? decodePageData(query.get("pageData"))
    : null;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [resetPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [page, setPage] = useState(+query.get("ppi") || 0);
  const [pageSize, setPageSize] = useState(+query.get("ps") || 5);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState(pageFilter?.keyword || "");
  const [searchKeyword, setSearchKeyword] = useState(pageFilter?.keyword || "");
  const [valueRole, setValueRole] = useState(pageFilter?.role || "");
  const [searchRole, setSearchRole] = useState(pageFilter?.role || "");
  const { auth } = useSelector((state) => state?.user);
  const { user_roles: rolesObj, user_roles_arr: rolesArr } = useSelector(
    (state) => state?.enumeration
  );
  const [sortModel, setSortModel] = useState([
    {
      field: "createdAt",
      sort: "desc",
    },
  ]);

  const toggleResetPasswordModal = () =>
    setPasswordModalVisible((prev) => !prev);

  const onPageSizeChange = (params) => {
    setPageSize(params?.pageSize);
    setPage(params?.page);
  };

  const onPageChange = (params) => {
    setPage(params?.page);
  };

  const onSortModelChange = (params) => {
    setSortModel([
      {
        field: params?.field,
        sort: params?.sort,
      },
    ]);
  };

  const onDelete = (item) => {
    swal({
      title: t("user-management:dialog.delete_title"),
      text: t("user-management:dialog.delete_description", {
        fullName: item?.fullName,
      }),
      icon: "warning",
      buttons: [t("common:button.cancel"), t("common:button.ok")],
    }).then((yes) => {
      if (yes) {
        deleteUser(item?.id);
      }
    });
  };

  const onResetPassword = (item) => {
    setPasswordModalVisible(true);
    formik?.setValues({
      id: item?.id,
      userAccount: item?.userAccount,
    });
  };

  const onEdit = (item) => {
    const params = {};
    const filterParams = {};

    if (searchKeyword) filterParams["keyword"] = searchKeyword;
    if (searchRole) filterParams["role"] = searchRole;

    if (page > 0) {
      params["ppi"] = page;
    }

    if (pageSize > 5) params["ps"] = pageSize;

    if (Object.keys(filterParams).length !== 0) {
      const tmp = encodePageData(filterParams);
      params["pageData"] = tmp;
    }

    navigate({
      pathname: `/dashboard/users/edit/${item.id}`,
      search: "?" + new URLSearchParams(params).toString(),
    });
  };

  const onSubmit = () => {
    setPage(0);
    setPageSize(5);
    setSearchKeyword(keyword);
    setSearchRole(valueRole);
  };

  const onReset = () => {
    deleteSearchParams();
    setKeyword("");
    setSearchKeyword("");
    setValueRole("");
    setSearchRole("");
    setPage(0);
    setPageSize(5);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page: page,
        amount: pageSize,
        search: searchKeyword,
        roleId: searchRole || 0,
        order: first(sortModel)?.field,
        mode: first(sortModel)?.sort?.toUpperCase(),
      };

      const resp = await UserManagementService.getAll(params);

      if (resp?.data?.success) {
        setData({
          data: resp?.data?.data?.map((record) => ({
            ...record,
            role: rolesObj?.[record?.roleId]?.nameEn,
            created_at: moment(record?.createdAt)?.format(DATE_TIME_FORMAT),
          })),
          total: resp?.data?.total,
        });
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const resp = await UserManagementService.deleteById(id);

      if (resp?.data?.success) {
        notify("success", t("user-management:messages.delete_success"));

        if (page > 0 && data?.data?.length === 1) {
          let newPage = page - 1;

          setPage(newPage);
        }

        fetchData();
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const fieldList = [
    {
      name: "userAccount",
      initialValue: "",
      validationType: "string",
      notRender: true,
    },
    {
      name: "id",
      fieldType: "input",
      validationType: "string",
      notRender: true,
    },
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

  const onSubmitPasswordForm = async (
    values,
    { setLoading: setPasswordLoading }
  ) => {
    try {
      setPasswordLoading(true);
      const res = await UserManagementService.updatePasswordById(
        values.id,
        values.password
      );
      if (res?.data?.success) {
        return notify(
          "success",
          t("user-management:messages.change_password_success")
        );
      }
      return notify(
        "error",
        t("user-management:messages.change_password_failed")
      );
    } catch (error) {
      return notify(
        "error",
        t("user-management:messages.change_password_failed")
      );
    } finally {
      setPasswordLoading(false);
      formik?.resetForm();
      toggleResetPasswordModal();
    }
  };

  const { formik, loading: resettingPassword } = useAppForm({
    fieldList,
    onSubmit: onSubmitPasswordForm,
  });

  const onSavePassword = () => formik?.handleSubmit();

  return {
    data,
    page,
    pageSize,
    loading,
    keyword,
    searchKeyword,
    valueRole,
    searchRole,
    roles: rolesArr,
    sortModel,
    auth,
    resetPasswordModalVisible,
    fieldList,
    formik,
    resettingPassword,
    onSavePassword,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onDelete,
    onSubmit,
    fetchData,
    setKeyword,
    setSearchKeyword,
    setValueRole,
    onReset,
    onSortModelChange,
    onResetPassword,
    toggleResetPasswordModal,
  };
};
