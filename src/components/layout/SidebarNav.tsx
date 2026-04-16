import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { useState, useEffect } from "react";
import { ModuleItem } from "../ContextApi/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getIcon(name?: string) {
  if (!name) return Icons.Circle;
  const Icon = (Icons as Record<string, any>)[name];
  return Icon ?? Icons.Circle;
}

function isProfileModule(item: ModuleItem) {
  return item.path?.toLowerCase().includes("profile") || item.code === "P";
}

/** True when current pathname matches this link path (exact or nested) */
function isPathActive(pathname: string, linkPath: string): boolean {
  if (!linkPath) return false;
  const normalized = linkPath.startsWith("/") ? linkPath : `/${linkPath}`;
  if (normalized === "/") return pathname === "/";
  return pathname === normalized || pathname.startsWith(normalized + "/");
}

/** When collapsed: flatten so only child menus show for parents that have children */
function getItemsToRender(modules: ModuleItem[], collapsed: boolean): ModuleItem[] {
  const filtered = modules.filter((item) => !isProfileModule(item));
  if (!collapsed) return filtered;
  const flat: ModuleItem[] = [];
  for (const item of filtered) {
    const children = (item.moduleList || []).filter((c) => c.code !== "PROF");
    if (children.length > 0) {
      flat.push(...children);
    } else {
      flat.push(item);
    }
  }
  return flat;
}

/** Stable key for a top-level module (used for open state) */
function getParentKey(item: ModuleItem): string {
  return item.path ?? item.name;
}

/** If pathname is under any child (or the parent) of a top-level module, return that parent's key */
function getOpenParentKeyForPathname(pathname: string, modules: ModuleItem[]): string | null {
  const filtered = modules.filter((item) => !isProfileModule(item));
  for (const item of filtered) {
    const children = (item.moduleList || []).filter((c) => c.code !== "PROF");
    if (children.length === 0) {
      const p = item.path?.startsWith("/") ? item.path : `/${item.path ?? ""}`;
      if (p && isPathActive(pathname, p)) return getParentKey(item);
      continue;
    }
    for (const child of children) {
      const p = child.path?.startsWith("/") ? child.path : `/${child.path ?? ""}`;
      if (p && isPathActive(pathname, p)) return getParentKey(item);
    }
    const parentPath = item.path?.startsWith("/") ? item.path : `/${item.path ?? ""}`;
    if (parentPath && isPathActive(pathname, parentPath)) return getParentKey(item);
  }
  return null;
}

const SIDEBAR_TOOLTIP_CLASS =
  "bg-accent-foreground/90 border border-border/80 text-background text-sm font-medium shadow-md px-3 py-2 rounded-md";

export function SidebarNav({
  modules,
  collapsed = false,
}: {
  modules: ModuleItem[];
  collapsed?: boolean;
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const [openParentKey, setOpenParentKey] = useState<string | null>(() =>
    getOpenParentKeyForPathname(pathname, modules)
  );

  useEffect(() => {
    const keyForRoute = getOpenParentKeyForPathname(pathname, modules);
    if (keyForRoute != null) setOpenParentKey(keyForRoute);
  }, [pathname, modules]);

  const itemsToRender = getItemsToRender(modules, collapsed);
  return (
    <ul className={cn("space-y-0.5", collapsed && "flex flex-col items-center")}>
      {itemsToRender.map((item, idx) => (
        <SidebarItem
          key={item.path ?? `${item.name}-${idx}`}
          item={item}
          level={0}
          collapsed={collapsed}
          openParentKey={openParentKey}
          setOpenParentKey={setOpenParentKey}
        />
      ))}
    </ul>
  );
}

function SidebarItem({
  item,
  level = 0,
  collapsed = false,
  openParentKey = null,
  setOpenParentKey,
}: {
  item: ModuleItem;
  level?: number;
  collapsed?: boolean;
  openParentKey?: string | null;
  setOpenParentKey?: (key: string | null) => void;
}) {
  const location = useLocation();
  const Icon = getIcon(item.icon);
  const hasChildren = item.moduleList && item.moduleList.length > 0;
  const children = (item.moduleList || []).filter((c) => c.code !== "PROF");

  const parentKey = level === 0 ? getParentKey(item) : null;
  const open = level === 0 && openParentKey != null && parentKey != null ? openParentKey === parentKey : false;
  const handleToggleParent = () => {
    if (setOpenParentKey && parentKey != null) setOpenParentKey(open ? null : parentKey);
  };

  const fontClass = level === 0 ? "font-semibold" : "font-medium";

  if (collapsed) {
    const path = item.path?.startsWith("/") ? item.path : `/${item.path ?? ""}`;
    if (!path || path === "/") return null;
    const isActive = isPathActive(location.pathname, path);
    return (
      <li className="w-full flex justify-center py-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={path}
              end={false}
              className={cn(
                "grid place-items-center w-8 h-8 min-w-8 min-h-8 rounded-md transition-all duration-200",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent-foreground/20 hover:text-foreground hover:scale-110",
              )}
            >
              <Icon className="h-5 w-5 shrink-0 block" strokeWidth={2.25} />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12} className={SIDEBAR_TOOLTIP_CLASS}>
            {item.name}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return (
    <li>
      {hasChildren ? (
        <>
          <div
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors duration-150 group",
              open
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              fontClass,
            )}
            onClick={handleToggleParent}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  open ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <span className="truncate text-sm">{item.name}</span>
            </div>
            <Icons.ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-all duration-150 text-muted-foreground group-hover:text-primary",
                open ? "rotate-180 text-primary" : "",
              )}
            />
          </div>

          {open && (
            <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-border/60 pl-4">
              {children.map((child) => (
                <SidebarItem
                  key={child.name}
                  item={child}
                  level={level + 1}
                  collapsed={false}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <NavLink
          to={item.path?.startsWith("/") ? item.path : `/${item.path}`}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 group",
              fontClass,
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <span className="truncate text-sm">{item.name}</span>
            </>
          )}
        </NavLink>
      )}
    </li>
  );
}
