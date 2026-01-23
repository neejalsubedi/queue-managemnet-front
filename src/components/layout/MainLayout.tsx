import { Button } from "@/components/ui/button";
import { LoadingData } from "@/helper/loadingData";
import { cn } from "@/lib/utils";
import {
  LogOut,
  // BarChart3,
  Menu,
  // LayoutDashboard,
  Package,
  X,
} from "lucide-react";
import { Suspense, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useApiMutation } from "../ApiCall/ApiMutation";
import { API_ENDPOINTS } from "../constants/ApiEndpoints/apiEndpoints";
import { useAuth } from "../ContextApi/AuthContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SidebarNav } from "./SidebarNav";

// const navigation = [
//   { name: "Dashboard", href: "/", icon: LayoutDashboard },
//   { name: "Reports", href: "reports", icon: BarChart3 },
//   { name: "Configurations", href: "configurations", icon: Bolt },
// ];
const MainLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const { mutate: postLogout, isPending } = useApiMutation(
    "post",
    API_ENDPOINTS.AUTH.LOGOUT
  );

  const handleLogout = () => {
    postLogout(undefined, {
      onSuccess: () => {
        navigate("/");
        logout();
      },
    });
  };

  if (isPending) return <LoadingData />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-subtle">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glass Effect */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-spring lg:translate-x-0 lg:static lg:flex lg:flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "glass border-r border-border/40 shadow-xl lg:shadow-none lg:bg-transparent lg:border-none lg:glass" // Adjusted for desktop transparency if desired, or keep glass
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center space-x-3 group cursor-default">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-foreground/90">AQMS</h1>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Manager</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <SidebarNav modules={user?.moduleList || []} />
          </nav>

          {/* Footer */}
          <div className="p-6">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-4 border border-primary/5">
              <div className="text-xs text-muted-foreground text-center font-medium">
                <p>© 2025 AQMS System</p>
                <p className="mt-1 opacity-70">v1.0.0 • Nepal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Top bar - Floating Glass */}
        <div className="sticky top-0 z-40 px-6 py-3">
          <div className="glass rounded-2xl px-4 py-2 flex h-16 items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden -ml-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="hidden md:flex flex-col">
                    <h2 className="text-sm font-semibold text-foreground">Dashboard</h2>
                    <p className="text-xs text-muted-foreground">Welcome back, {user?.fullName || 'User'}</p>
                 </div>
             </div>

            <div className="flex items-center gap-3 sm:gap-5">
              {/* <div className="hidden sm:block text-right">
                <div className="text-xs font-medium text-foreground">System Status</div>
                <div className="flex items-center justify-end gap-1.5">
                   <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                   <span className="text-[10px] text-muted-foreground">Online</span>
                </div>
              </div> */}

              <div className="h-8 w-[1px] bg-border/50 hidden sm:block"></div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Log out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">End session</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Suspense fallback={<LoadingData />}>
               <div className="min-h-[calc(100vh-8rem)]">
                 <Outlet />
               </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
