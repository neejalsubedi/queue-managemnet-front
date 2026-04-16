import UnProtectedRoute from "@/helper/UnProtectedRoute";
import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const PublicLayout = lazy(() => import("../core/public/layout/PublicLayout"));
const LandingPage = lazy(() => import("../core/public/LandingPage"));
const Login = lazy(() => import("../core/public/Login/Login"));
const Signup = lazy(() => import("../core/public/Signup"));

const fallback = (
  <div className="min-h-screen flex items-center justify-center bg-background">
    Loading...
  </div>
);

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={fallback}>
        <PublicLayout />
      </Suspense>
    ),
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={null}>
            <UnProtectedRoute>
              <Login />
            </UnProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={null}>
            <UnProtectedRoute>
              <Signup />
            </UnProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
