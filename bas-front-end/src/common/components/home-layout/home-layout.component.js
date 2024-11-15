import { ProfileInformation } from "common/components";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PageHeader } from "../index";
import classes from "./home-layout.style.module.css";

export const HomeLayout = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state?.user);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className={classes.container}>
      <PageHeader rightComponent={<ProfileInformation />} logoRedirectUrl="/" />

      <div className={classes.content}>{children}</div>
    </div>
  );
};
