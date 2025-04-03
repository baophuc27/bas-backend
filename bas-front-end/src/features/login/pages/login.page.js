import { Box } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FormGroup } from "common/components";
import { AuthService } from "common/services";
import { notify } from "common/utils/dashboard-toast.util";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { logIn } from "redux/slices/user.slice";
import { LoginButton } from "../components";
import { useLogin } from "../hooks";
import classes from "./login.style.module.css";

export const LoginPage = (props) => {
  const { t } = useTranslation();
  const { fieldList, formik, loading } = useLogin({ t });
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state?.user);
  const { logo_url: logoUrl } = useSelector((state) => state?.organization);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogIn = async () => {
    try {
      setIsSubmitting(true);

      const { email, password } = formik?.values;

      const resp = await AuthService.logIn({
        username: email,
        password,
      });

      if (resp?.data?.success) {
        notify("success", t("login:message.login_successfully"));

        const responseData = resp?.data;
        const userData = responseData?.data;

        dispatch(
          logIn({
            auth: userData,
            isLoggedIn: true,
            token: responseData?.token,
            refreshToken: responseData?.refreshToken,
            roleId: userData?.roleId,
            permissions: userData?.permission,
          }),
        );
      }
    } catch (error) {
      console.log(error);

      notify("error", t("login:message.login_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <img
          src="https://api.vnemisoft.com/public/avatars/1674039885411.jpg"
          alt="Logo"
          className={classes.logo}
        />
      </Box>

      <h1 className={classes.title}>{t("login:title")}</h1>

      {!isSubmitting ? (
        <>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup items={fieldList} formik={formik} />
            <LoginButton
              loading={loading}
              formik={formik}
              t={t}
              onClick={onLogIn}
            />
          </form>
        </>
      ) : (
        <Box className={classes.loader}>
          <CircularProgress color="primary" />
        </Box>
      )}
    </Box>
  );
};
