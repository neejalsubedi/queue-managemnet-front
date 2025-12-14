import {
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from "@/utility/authService";
import { createContext, useContext, useEffect, useState } from "react";
import { useGetInit } from "../ApiCall/Api";
export interface ModuleItem {
  name: string;
  icon: string;
  path: string | null;
  code: string;
  moduleList: ModuleItem[];
}
export interface UserData {
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  moduleList: ModuleItem[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  refetchInit: () => void;
  user: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refetchInit: () => {},
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );

  const {
    data: fetchedInit,
    isPending: pendingInit,
    refetch: refetchInit,
  } = useGetInit();

  useEffect(() => {
    const data = fetchedInit?.data;
    if (data) {
      setIsAuthenticated(true);
      setUser(Array.isArray(data) ? data[0] : data);
    }
    setLoading(pendingInit);
  }, [fetchedInit, pendingInit]);

  const login = async (token: string, refreshToken: string) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
    await refetchInit();
  };

  const logout = () => {
    removeToken();
    removeRefreshToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, loading, refetchInit }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
