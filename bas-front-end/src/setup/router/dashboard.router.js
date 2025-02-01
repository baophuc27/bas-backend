import { lazy } from "react";
import { Navigate } from "react-router-dom";

const NotFoundPage = lazy(() => import("features/not-found"));

const AccountInfoPage = lazy(() => import("features/account-info"));

const UserManagementListPage = lazy(
  () => import("features/user-management/pages/user-management-list.page"),
);
const UserManagementEditPage = lazy(
  () => import("features/user-management/pages/user-management-edit.page"),
);
const UserManagementAddPage = lazy(
  () => import("features/user-management/pages/user-management-add.page"),
);

const RecordManagementPage = lazy(
  () => import("features/record-management/pages/record-management-list.page"),
);
const RecordManagementDetailPage = lazy(
  () =>
    import("features/record-management/pages/record-management-detail.page"),
);

const BerthManagementListPage = lazy(
  () => import("features/berth-management/pages/list.page"),
);
const BerthManagementAddPage = lazy(
  () => import("features/berth-management/pages/detail.page"),
);

const DataAppManagementListPage = lazy(
  () => import("features/data-app-management/pages/list.page"),
)

const DataAppDetailPage = lazy(
  () => import("features/data-app-management/pages/detail.page"),
)

const AlarmHistoryListPage = lazy(
  () => import("features/alarm-history/pages/list.page"),
);

const PortInfoPage = lazy(() => import("features/port"));

export const dashboardRouter = [
  {
    path: "",
    element: <Navigate to="/dashboard/record-management" replace />,
  },
  {
    path: "account-info",
    element: <AccountInfoPage />,
  },
  {
    path: "port-info",
    element: <PortInfoPage />,
  },
  {
    path: "record-management",
    children: [
      {
        path: "",
        element: <RecordManagementPage />,
      },
      {
        path: "detail/:id",
        element: <RecordManagementDetailPage />,
      },
    ],
  },
  {
    path: "berth-management",
    children: [
      {
        path: "",
        element: <BerthManagementListPage />,
      },
      {
        path: "edit/:id",
        element: <BerthManagementAddPage />,
      },
      {
        path: "add",
        element: <BerthManagementAddPage />,
      },
    ],
  },
  {
    path: "data-app-management",
    children : [
      {
        path: "",
        element: <DataAppManagementListPage />
      },
      {
        path: "edit/:id",
        element: <DataAppDetailPage/>,
      },
      {
        path: "add",
        element: <DataAppDetailPage/>
      }
    ]
  },
  {
    path: "alarm-history",
    children: [
      {
        path: "",
        element: <AlarmHistoryListPage />,
      },
    ],
  },
  {
    path: "users",
    children: [
      {
        path: "",
        element: <UserManagementListPage />,
      },
      {
        path: "add",
        element: <UserManagementAddPage />,
      },
      {
        path: "edit/:id",
        element: <UserManagementEditPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
