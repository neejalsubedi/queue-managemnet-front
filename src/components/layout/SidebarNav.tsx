import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { useState } from "react";
import { ModuleItem } from "../ContextApi/AuthContext";

function getIcon(name?: string) {
  if (!name) return Icons.Circle; // fallback

  // lucide icons exist as keys of this object
  const Icon = (Icons as Record<string, any>)[name];

  return Icon ?? Icons.Circle;
}

export function SidebarNav({ modules }: { modules: ModuleItem[] }) {
  return (
    <ul className="space-y-2">
      {modules.map((item) => (
        <SidebarItem key={item.name} item={item} />
      ))}
    </ul>
  );
}

function SidebarItem({ item }: { item: ModuleItem }) {
  const Icon = getIcon(item.icon);
  const hasChildren = item.moduleList && item.moduleList.length > 0;

  const [open, setOpen] = useState(false);

  return (
    <li>
      {hasChildren ? (
        <>
          {/* Parent Item */}
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              {item.name}
            </div>
            <Icons.ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </div>

          {/* Nested Items */}
          {open && (
            <ul className="ml-6 mt-1 space-y-1 border-l pl-3">
              {item.moduleList.map((child) => (
                <SidebarItem key={child.name} item={child} />
              ))}
            </ul>
          )}
        </>
      ) : (
        // Childless item -> NavLink
        <NavLink
          to={item.path?.startsWith("/") ? item.path : `/${item.path}`}
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <Icon className="mr-3 h-5 w-5" />
          {item.name}
        </NavLink>
      )}
    </li>
  );
}
