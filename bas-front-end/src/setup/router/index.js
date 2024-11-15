import { AppContainer, AuthLayout, DashboardLayout } from "common/components";
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { authRouter } from "./auth.router";
import { dashboardRouter } from "./dashboard.router";

const NotFoundPage = React.lazy(() => import("features/not-found"));
const ForbiddenPage = React.lazy(() => import("features/forbidden"));
const RedirectPage = React.lazy(() => import("features/redirect"));

const HomePage = React.lazy(() => import("features/home"));
const DockVisualizationPage = React.lazy(() => import("features/dock"));
const ReplayVisualizationPage = React.lazy(() => import("features/replay"));

export const router = createBrowserRouter([
  {
    path: "",
    element: <AppContainer />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/docks/:id",
        element: <DockVisualizationPage />,
      },
      {
        path: "/replays",
        element: <ReplayVisualizationPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: dashboardRouter,
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: authRouter,
      },
      {
        path: "/forbidden",
        element: <ForbiddenPage />,
      },
      {
        path: "/redirect",
        element: <RedirectPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
