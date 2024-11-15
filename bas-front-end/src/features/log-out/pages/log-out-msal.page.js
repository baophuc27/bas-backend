import { useMsal } from "@azure/msal-react";
import { Box, CircularProgress } from "@material-ui/core";
import { AuthService } from "common/services";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaPredicate } from "react-media-hook";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "redux/slices/user.slice";
import { loginRequest } from "setup/ad-sso/msal.instance";
import { AccountInformation } from "../components/account-information.component";
import { LoginAnotherAccountButton } from "../components/login-anther-button.component";
import { LogoutButton } from "../components/logout-button.component";
import styles from "./log-out.style.module.css";

const DONT_USE_LOGIN_PAGE = true;

export const LogOutPage = () => {
  const { t } = useTranslation();
  const { refreshToken, auth } = useSelector((state) => state?.user);
  const { instance } = useMsal();

  const dispatch = useDispatch();
  const isMobile = useMediaPredicate("(max-width: 991px)");
  const activeAccount = instance.getActiveAccount();
  const [loading, setLoading] = useState(true);

  const redirectLogin = () => {
    dispatch(logOut());
    window.location.replace("/");
  };

  const logoutMsal = async (account) => {
    instance.setActiveAccount(null);
    return instance.logout({
      account: account,
      postLogoutRedirectUri: process.env.REACT_APP_MSAL_LOGOUT_REDIRECT_URL,
      ...loginRequest,
    });
  };

  const onLogout = async () => {
    setLoading(true);
    try {
      await AuthService.logOut(refreshToken);
    } catch (error) {
    } finally {
      dispatch(logOut());
      logoutMsal(activeAccount);
    }
  };

  const loginAnotherAccount = async () => {
    dispatch(logOut());
    redirectLogin();
  };

  useEffect(() => {
    DONT_USE_LOGIN_PAGE && loginAnotherAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (DONT_USE_LOGIN_PAGE) return null;

  return (
    <Box className={styles.container}>
      <Box className={`${styles.card} ${isMobile ? styles.mobile : ""}`}>
        <Box className={`${styles.cardBody}`}>
          {loading ? (
            <Box>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
              <AccountInformation
                data={{
                  username:
                    auth?.auth?.userAccount || activeAccount?.username,
                  avatar: auth?.auth?.avatar,
                  fullName: auth?.auth?.fullName || activeAccount?.name,
                }}
              />
              <LogoutButton t={t} onClick={onLogout} />
              <LoginAnotherAccountButton t={t} onClick={loginAnotherAccount} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
