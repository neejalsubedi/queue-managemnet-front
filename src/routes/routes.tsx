import { useAuth } from "@/components/ContextApi/AuthContext";
import { privateRoutes } from "./privateRoutes";
import { publicRoutes } from "./publicRoutes";
import { wrapWithProtection } from "@/helper/wrapWithProtection";

export const useDynamicRoutes = () => {
  const { isAuthenticated } = useAuth();
  // const isAuthenticated = true;
  const protectedRoutes = wrapWithProtection(privateRoutes);

  return isAuthenticated ? protectedRoutes : publicRoutes;
};
