import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoleLabel } from "common/constants/role.constant";
import { useAppForm } from "common/hooks";
import { AccountInfoService } from "common/services";
import { notify } from "common/utils/dashboard-toast.util";
import { getFileSizeInMB } from "common/utils/file.util";
import { updateInfo } from "redux/slices/user.slice";
import { FILE_FORMAT_LIST, MAX_FILE_SIZE_IN_MB } from "../constants/index";

export const useAccountInfo = (t) => {
  const [data, setData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [isAvatarValid, setIsAvatarValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [orgLogo, setOrgLogo] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [orgId, setOrgId] = useState("");
  const dispatch = useDispatch();
  const { user_roles: rolesObj } = useSelector((state) => state?.enumeration);

  // Updated fieldList with additional fields
  const fieldList = [
    {
      name: "fullName",
      label: t("account-info:label.full-name"),
      fieldType: "text",
      initialValue: data?.fullName,
      disabled: true,
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
      fieldType: "text",
      initialValue: data?.email,
      placeholder: t("user-management:placeholder.email"),
      disabled: true,
      validationType: "string",
      validations: [
        {
          type: "email",
          params: [t("account-info:messages.email")],
        },
      ],
    },
    // {
    //   name: "avatar",
    //   label: t("account-info:label.avatar"),
    //   fieldType: "text",
    //   initialValue: data?.avatar,
    //   notRender: true,
    // },
    // {
    //   name: "role",
    //   label: t("account-info:label.role"),
    //   fieldType: "text",
    //   initialValue: getRoleLabel(t, data?.roleId),
    //   disabled: true,
    // },
    // {
    //   name: "orgLogo",
    //   label: t("account-info:label.org-logo"),
    //   fieldType: "text",
    //   initialValue: data?.orgLogo,
    //   disabled: true,
    // },
    {
      name: "roleName",
      label: t("account-info:label.role-name"),
      fieldType: "text",
      initialValue: roleName,
      disabled: true,
    },
    // {
    //   name: "permissions",
    //   label: t("account-info:label.permissions"),
    //   fieldType: "text",
    //   initialValue: data?.permissions.join(", "),
    //   disabled: true,
    // },
    {
      name: "orgId",
      label: t("account-info:label.org-id"),
      fieldType: "text",
      initialValue: data?.orgId,
      disabled: true,
    },
  ];

  const getErrorMessageFromCode = (t, code) => {
    switch (code) {
      case "DUPLICATE_EMAIL":
        return t("account-info:messages.duplicated-email");

      case "DUPLICATE_PHONE":
        return t("account-info:messages.duplicated-phone");

      case "DUPLICATE_USERNAME":
        return t("account-info:messages.duplicated-username");

      default:
        return "";
    }
  };

  const onSubmit = async (values, { setSubmitting, setLoading }) => {
    try {
      setSubmitting(true);
      setLoading(true);
      setIsAvatarValid(true);

      if (values.avatarFile) {
        if (!FILE_FORMAT_LIST.includes(values.avatarFile.type)) {
          return;
        }

        if (getFileSizeInMB(values.avatarFile.size) > MAX_FILE_SIZE_IN_MB) {
          return;
        }
      }

      const postData = {
        avatar: values.avatarFile ? null : values.avatar,
        avatarFile: values.avatarFile,
        phone: values?.phone?.trim() || null,
        email: values?.email?.trim() || null,
        fullName: values?.fullName?.trim(),
      };

      const resp = await AccountInfoService.update(postData);

      if (resp?.data?.success) {
        const avatarResp =
          resp?.data?.data?.avatar + `?${new Date().getTime()}`;
        const fullName = resp?.data?.data?.fullName;

        dispatch(updateInfo({ avatar: avatarResp, fullName }));

        notify("success", t("account-info:dialog.success-message"));
      } else {
        throw new Error(resp?.data?.message);
      }
    } catch (error) {
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
        notify("error", t("account-info:dialog.failed-message"));
      }
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const { formik, loading } = useAppForm({ fieldList, onSubmit });

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const resp = await AccountInfoService.getById();

      if (resp?.data?.success) {
        const userData = resp?.data?.data;
        setData(userData);
        setAvatar(userData.avatar);
        setOrgLogo(userData?.orgLogo);
        setRoleName(userData?.roleName);
        setPermissions(userData?.permissions.split(","));
        setOrgId(userData?.orgId);

        dispatch(
          updateInfo({
            avatar: userData?.avatar,
            fullName: userData?.fullName,
            roleName: userData?.roleName,
            orgName: userData?.orgName,
            orgLogo: userData?.orgLogo,
            permissions: userData?.permissions.split(","),
          }),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resizeImage = (base64Str, maxWidth = 400, maxHeight = 400) => {
    return new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  };

  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (!FILE_FORMAT_LIST.includes(file.type)) {
        setIsAvatarValid("type");
        return;
      }

      if (getFileSizeInMB(file.size) > MAX_FILE_SIZE_IN_MB) {
        setIsAvatarValid("size");
        return;
      }

      setIsAvatarValid(true);
    }
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);

    reader.onloadend = (e) => {
      const loadImage = async () => {
        const resizedImage = await resizeImage(reader.result);
        setAvatar(resizedImage);
      };

      loadImage();
    };
    formik.setFieldValue("avatarFile", file);
  };

  const handleImageCancel = () => {
    setAvatar(null);
    setIsAvatarValid(true);
    formik.setFieldValue("avatarFile", null);
    formik.setFieldValue("avatar", null);
  };

  const handleResetForm = () => {
    formik.setFieldValue("fullName", data?.fullName);
    formik.setFieldValue("email", data?.email);
    formik.setFieldValue("phone", data?.phone);
  };

  return {
    formik,
    loading,
    fieldList,
    data,
    avatar,
    isLoading,
    isAvatarValid,
    orgLogo,
    roleName,
    permissions,
    orgId,
    fetchData,
    handleLogoChange,
    handleImageCancel,
    handleResetForm,
  };
};
