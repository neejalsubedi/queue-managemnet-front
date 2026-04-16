import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { LogOut } from "lucide-react";
import { useApiMutation } from "@/components/ApiCall/ApiMutation";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";

const ErrorPage = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { mutate: postLogout } = useApiMutation(
    "post",
    API_ENDPOINTS.AUTH.LOGOUT,
  );
  const isUnauthorized = location.pathname === "/unauthorized";

  const handleLogout = () => {
    postLogout(undefined, {
      onSuccess: () => {
        logout();
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          {isUnauthorized
            ? "403 - Unauthorized Access"
            : "404 - Page Not Found"}
        </h1>
        <p className="text-lg mb-6 text-center">
          {isUnauthorized
            ? "You don't have permission to access this page. Please contact your administrator if you believe this is an error."
            : "We're sorry, but the page you are trying to access could not be found. It might have been removed, renamed, or is temporarily unavailable."}
        </p>
        <div className="flex gap-4">
          <Link to="/">
            <Button size={"lg"}>Return to Homepage</Button>
          </Link>
          {isUnauthorized && (
            <Button size={"lg"} variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
