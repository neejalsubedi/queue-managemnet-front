import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 left-1/2 z-60 flex max-h-screen w-full -translate-x-1/2 flex-col gap-3 md:max-w-[350px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "relative flex w-full items-start gap-4 rounded-xl border p-4 shadow-xl backdrop-blur-md overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border border-border",
        success:
          "bg-success/70 text-success-foreground border-l-4 border-success",
        destructive:
          "bg-destructive/50 text-destructive-foreground border-l-4 border-destructive",
        warning:
          "bg-warning/20 text-warning-foreground border-l-4 border-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const iconMap = {
  default: <Info className="text-muted-foreground" />,
  success: <CheckCircle className="text-success-foreground" />,
  destructive: <XCircle className="text-destructive-foreground" />,
  warning: <AlertTriangle className="text-warning-foreground" />,
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant }),
        "data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out",
        className,
      )}
      {...props}
    >
      <div className="pt-1">{iconMap[variant || "default"]}</div>
      <div className="flex-1 space-y-1">{children}</div>

      {/* progress bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray/10">
        <div
          className={cn(
            "h-full w-full animate-toast-progress",
            variant === "success"
              ? "bg-success"
              : variant === "destructive"
                ? "bg-destructive"
                : "bg-foreground",
          )}
        />
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-80", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:text-foreground",
      className,
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  type ToastProps,
  type ToastActionElement,
};
