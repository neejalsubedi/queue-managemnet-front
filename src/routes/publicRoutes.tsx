import UnProtectedRoute from "@/helper/UnProtectedRoute";
import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const Login = lazy(() => import("../core/public/Login/Login"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <UnProtectedRoute>
        <Login />
      </UnProtectedRoute>
    ),
    errorElement: (
      <>
        <div>Error</div>
      </>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
