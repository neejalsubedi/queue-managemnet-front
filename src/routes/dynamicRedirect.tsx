import { useAuth } from "@/components/ContextApi/AuthContext";
import { Navigate } from "react-router-dom";

const findFirstValidPath = (modules: any[]): string | null => {
  for (const module of modules) {
    if (module.path) return module.path;
    if (module.moduleList && module.moduleList.length > 0) {
      const nestedPath = findFirstValidPath(module.moduleList);
      if (nestedPath) return nestedPath;
    }
  }
  return null;
};

export const DynamicRedirect = () => {
  const { user } = useAuth();

  if (!user?.moduleList || user.moduleList.length === 0) {
    return <Navigate to="/unauthorized" replace />;
  }

  const firstPath = findFirstValidPath(user.moduleList);

  return <Navigate to={firstPath || "/unauthorized"} replace />;
};
