import { AuthService } from "common/services";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { logOut } from "redux/slices/user.slice";

export const LogOutPage = () => {
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);
  const { refreshToken } = useSelector((state) => state?.user);

  useEffect(() => {
    const callLogout = async () => {
      try {
        await AuthService.logOut(refreshToken);
      } catch (error) {
        console.log(error);
      } finally {
        setRedirect(true);
        dispatch(logOut());
      }
    };
    callLogout();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (redirect) return <Navigate to="/auth/login" replace />;

  return <></>;
};
