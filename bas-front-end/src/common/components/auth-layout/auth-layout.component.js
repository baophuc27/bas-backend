import { Outlet } from "react-router-dom";
import { PageHeader } from "../index";
import classes from "./auth-layout.style.module.css";

export const AuthLayout = (props) => {
  return (
    <>
      <div className={classes.container}>
        <PageHeader />

        <div className={classes.content}>
          <Outlet />
        </div>
      </div>

      {/* <ToastContainer containerId="standard-toast" enableMultiContainer /> */}
    </>
  );
};
