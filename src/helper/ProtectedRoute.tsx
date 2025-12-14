import { matchPath, Navigate, useLocation } from "react-router-dom";
import { ReactNode, useMemo } from "react";
import { useAuth } from "@/components/ContextApi/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  // If not authenticated at all -> go to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but user data wasn't loaded for some reason, show loader
  if (isAuthenticated && !user) {
    return null;
  }

  function extractPaths(modules: any[]): string[] {
    const paths: string[] = [];

    for (const mod of modules) {
      if (mod.path) paths.push(mod.path);
      if (mod.moduleList?.length) {
        paths.push(...extractPaths(mod.moduleList));
      }
    }

    return paths;
  }

  const frontendAllowedPaths = [
    "dashboard-details/:type",
    "permission/:id",
    "history/:id",
    "refund/:id",
  ];

  const allowedPaths = useMemo(() => {
    return [...extractPaths(user?.moduleList || []), ...frontendAllowedPaths];
  }, [user]);

  // Allow "/" and "/unauthorized" always
  if (location.pathname === "/" || location.pathname === "/unauthorized") {
    return <>{children}</>;
  }

  const isAllowed = allowedPaths.some((pattern) =>
    matchPath({ path: pattern, end: false }, location.pathname)
  );

  if (!isAllowed) {
    console.warn("Unauthorized access to:", location.pathname);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
