import { matchPath, Navigate, useLocation } from "react-router-dom";
import { ReactNode, useMemo } from "react";
import { useAuth } from "@/components/ContextApi/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

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
    "patient-management/add",
    "permission/:id",
  ];

  // ✅ Move this ABOVE all returns
  const allowedPaths = useMemo(() => {
    return [...extractPaths(user?.moduleList || []), ...frontendAllowedPaths];
  }, [user]);

  // Now do conditional returns

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !user) {
    return null;
  }

  if (location.pathname === "/" || location.pathname === "/unauthorized") {
    return <>{children}</>;
  }

  const isAllowed = allowedPaths.some((pattern) =>
    matchPath({ path: pattern, end: false }, location.pathname),
  );

  if (!isAllowed) {
    console.warn("Unauthorized access to:", location.pathname);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
