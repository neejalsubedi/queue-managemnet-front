import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./components/ContextApi/AuthContext.tsx";
import { StrictMode } from "react";
import { Toaster } from "./components/ui/toaster.tsx";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalLoader from "./components/layout/GlobalLoader.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          {/* <GlobalLoader /> */}
          <App />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);
