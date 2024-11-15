import React from "react";

const LoginPage = React.lazy(() => import("features/login"));
const LogOutPage = React.lazy(() => import("features/log-out"));

export const authRouter = [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "log-out",
    element: <LogOutPage />,
  },
];
