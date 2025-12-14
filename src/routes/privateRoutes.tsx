import { DashboardProvider } from "@/components/ContextApi/DashboardProvider";
import { ReportsProvider } from "@/components/ContextApi/ReportsProvider";
import ErrorPage from "@/helper/errorPage";
import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { DynamicRedirect } from "./dynamicRedirect";



const PrivateLayout = lazy(() => import("../components/layout/MainLayout"));
const Dashboard = lazy(() => import("../core/private/Dashboard/Dashboard"));
const Reports = lazy(() => import("../core/private/Reports/Reports"));
const UserTable = lazy(() => import("../core/private/UserManagement/StaffManagement/UserTable"));
// const Configurations = lazy(
//   () => import("../core/private/Configurations/Confgurations")
// );

export const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PrivateLayout />,
    errorElement: (
      <>
        <div>Error</div>
      </>
    ),
    children: [
      {
        index: true,
        element: <DynamicRedirect />,
      },
      {
        path: "home",
        element: (
          <DashboardProvider>
            <Dashboard />
          </DashboardProvider>
        ),
      },
      {
        path: "reports",
        element: (
          <ReportsProvider>
            <Reports />
          </ReportsProvider>
        ),
      },
      {
        path: "/staff-management",
        element: <UserTable />,
      },

      // {
      //   path: "configuarations",
      //   element: <Configurations />,
      // },
    ],
  },
  {
    path: "/unauthorized",
    element: <ErrorPage />,
  },
  {
    path: "*",
    element: <Navigate to="/unauthorized" replace />,
  },
];
