import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

/* =======================
   Tabs Root
======================= */
const Tabs = TabsPrimitive.Root

/* =======================
   Tabs List
======================= */
const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            // container
            "inline-flex h-11 items-center gap-1 rounded-xl bg-muted/60 ",
            "border border-border/50 shadow-sm",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

/* =======================
   Tabs Trigger
======================= */
const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            // base
            "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium transition-all",
            "text-muted-foreground",

            // hover (inactive only)
            "data-[state=inactive]:hover:bg-muted/60 data-[state=inactive]:hover:text-foreground",

            // active
            "data-[state=active]:bg-blue-400",
            "data-[state=active]:text-white",
            "data-[state=active]:shadow-md",
            "data-[state=active]:ring-1 data-[state=active]:ring-blue-600/30",

            // focus
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

            // disabled
            "disabled:pointer-events-none disabled:opacity-50",

            className
        )}
        {...props}
    />
))

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/* =======================
   Tabs Content
======================= */
const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-4 rounded-lg bg-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
