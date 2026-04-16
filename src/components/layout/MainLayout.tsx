import { Suspense, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Package, Menu, X, LogOut, User, ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApiMutation } from "../ApiCall/ApiMutation";
import { API_ENDPOINTS } from "../constants/ApiEndpoints/apiEndpoints";
import { useAuth } from "../ContextApi/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingData } from "@/helper/loadingData";
import { SidebarNav } from "./SidebarNav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_STORAGE_KEY = "main-sidebar-collapsed";

function getStoredSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function setStoredSidebarCollapsed(value: boolean) {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
  } catch (_) { }
}

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(getStoredSidebarCollapsed);
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsDesktop(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleToggleDesktopSidebar = () => {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      setStoredSidebarCollapsed(next);
      return next;
    });
  };

  const sidebarCollapsed = isDesktop && desktopCollapsed;

  const profileModule = user?.moduleList?.find(
    (m) => m.path?.toLowerCase().includes("profile") || m.code === "P"
  );
  const profilePath = profileModule?.path?.startsWith("/")
    ? profileModule.path
    : profileModule?.path
      ? `/${profileModule.path}`
      : "/profile";
  const showProfile = !!profileModule;
  const displayName = user?.fullName || user?.username || "User";

  const { mutate: postLogout, isPending } = useApiMutation(
    "post",
    API_ENDPOINTS.AUTH.LOGOUT,
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
    <div className="flex h-screen w-full overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: mobile drawer w-65; desktop expanded lg:w-64, collapsed lg:w-16 */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform bg-card border-r border-border transition-[width,transform] duration-200 ease-in-out flex flex-col",
          "w-65 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          desktopCollapsed ? "lg:w-16" : "lg:w-64",
        )}
      >
        <div className="flex flex-col h-full min-w-0">
          {/* Logo */}
          <div
            className={cn(
              "flex h-16 items-center border-b border-border bg-card shrink-0 transition-[padding] duration-200",
              sidebarCollapsed ? "justify-center px-2 lg:px-2" : "justify-between px-4 lg:px-4",
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <h1 className="text-xl font-bold text-foreground truncate">AQMS</h1>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Nav */}
          <nav
            className={cn(
              "flex-1 overflow-y-auto column-scrollbar min-h-0",
              sidebarCollapsed ? "px-0 py-2" : "px-2 py-1",
            )}
          >
            <TooltipProvider delayDuration={300}>
              <SidebarNav
                modules={user?.moduleList || []}
                collapsed={sidebarCollapsed}
              />
            </TooltipProvider>
          </nav>

          {/* Desktop collapse toggle + Footer */}
          <div className="border-t border-border shrink-0">
            {isDesktop && (
              <TooltipProvider delayDuration={300}>
                <div className="flex items-center justify-center py-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-9 text-muted-foreground hover:text-foreground hover:bg-muted",
                          sidebarCollapsed ? "w-9 px-0" : "w-full justify-center gap-2",
                        )}
                        onClick={handleToggleDesktopSidebar}
                        aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                      >
                        {desktopCollapsed ? (
                          <PanelLeft className="h-4 w-4" />
                        ) : (
                          <>
                            <PanelLeftClose className="h-4 w-4" />
                            <span className="text-sm">Collapse</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={12}
                      className="bg-card border border-border/80 text-foreground text-sm font-medium shadow-md px-3 py-2 rounded-md"
                    >
                      {desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
            {!sidebarCollapsed && (
              <div className="p-4">
                <div className="text-center text-sm text-muted-foreground">
                  <p>© 2025 AQMS</p>
                  <p>Nepal</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="py-2 px-1 text-center">
                <p className="text-[10px] text-muted-foreground">© AQMS</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Top bar */}
        <div className="sticky w-inherit top-0 z-20 h-16 border-b-2 border-border/50 bg-background/95 backdrop-blur-sm shadow-sm">
          <div className="flex h-16 items-center px-2">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-9 w-9 p-0 hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden sm:block text-sm text-muted-foreground">
              Welcome to Appointment & Queue Management System
            </div>
            <div className="ml-auto flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="User menu"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium max-w-[140px] truncate hidden sm:inline">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {showProfile && (
                    <DropdownMenuItem asChild>
                      <Link to={profilePath} className="flex items-center gap-2 cursor-pointer py-2.5">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer py-2.5 mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden column-scrollbar py-2 px-3">
          <Suspense fallback={<LoadingData />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
