import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ModuleItem } from "../ContextApi/AuthContext";

function getIcon(name?: string) {
  if (!name) return Icons.Circle; // fallback

  // lucide icons exist as keys of this object
  const Icon = (Icons as Record<string, any>)[name];

  return Icon ?? Icons.Circle;
}

export function SidebarNav({ modules }: { modules: ModuleItem[] }) {
  return (
    <ul className="space-y-1.5 px-2">
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
            className={cn(
              "group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
              open && "bg-accent/50 text-foreground"
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4.5 w-4.5 transition-colors group-hover:text-primary" />
              <span>{item.name}</span>
            </div>
            <Icons.ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground/70 transition-transform duration-200",
                open && "rotate-180 text-foreground"
              )}
            />
          </div>

          {/* Nested Items */}
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <ul className="overflow-hidden">
              <div className="ml-6 mt-1 space-y-1 border-l border-border/50 pl-3">
                {item.moduleList.map((child) => (
                  <SidebarItem key={child.name} item={child} />
                ))}
              </div>
            </ul>
          </div>
        </>
      ) : (
        // Childless item -> NavLink
        <NavLink
          to={item.path?.startsWith("/") ? item.path : `/${item.path}`}
          className={({ isActive }) =>
            cn(
              "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
            )
          }
        >
          <Icon className={cn("mr-3 h-4.5 w-4.5 transition-colors", 
             // inactive icon color logic if needed
          )} />
          {item.name}
        </NavLink>
      )}
    </li>
  );
}
