import { lazy, Suspense, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Clock, List, History, CalendarPlus } from "lucide-react";

const TAB_PARAM = "tab";

const TABS = [
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "history", label: "History" },
] as const;

const DEFAULT_TAB = "live";

function tabFromParams(searchParams: URLSearchParams): (typeof TABS)[number]["value"] {
  const t = searchParams.get(TAB_PARAM);
  const valid = t && TABS.some((tab) => tab.value === t);
  return (valid ? t : DEFAULT_TAB) as (typeof TABS)[number]["value"];
}

const UpcomingTab = lazy(() => import("./tabs/UpcomingTab"));
const LiveQueueTab = lazy(() => import("./tabs/LiveQueueTab"));
const HistoryTab = lazy(() => import("./tabs/HistoryTab"));

function TabFallback() {
  return (
    <div className="flex items-center justify-center min-h-[280px] text-muted-foreground">
      Loading…
    </div>
  );
}

export default function AppointmentTabs() {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = tabFromParams(searchParams);

  const setActiveTabPersisted = useCallback(
    (v: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(TAB_PARAM, v);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Appointment Management</h1>
          <p className="text-muted-foreground mt-1">
            Real-time queue, upcoming appointments, and history.
          </p>
        </div>
        <Button asChild className="shrink-0" size="default">
          <Link to="/appointment-management/book-appointment" className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            Book Appointment
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTabPersisted}>
        {!isMobile ? (
          <TabsList className="flex flex-wrap gap-1 bg-muted/60 p-1 h-auto">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2"
              >
                {tab.value === "live" && <Clock className="h-4 w-4" />}
                {tab.value === "upcoming" && <List className="h-4 w-4" />}
                {tab.value === "history" && <History className="h-4 w-4" />}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        ) : (
          <Select value={activeTab} onValueChange={setActiveTabPersisted}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {TABS.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="mt-4 bg-card border rounded-lg">
          <Suspense fallback={<TabFallback />}>
            <TabsContent value="live" className="m-0 p-2">
              <LiveQueueTab />
            </TabsContent>
            <TabsContent value="upcoming" className="m-0 p-2">
              <UpcomingTab />
            </TabsContent>
            <TabsContent value="history" className="m-0 p-2">
              <HistoryTab />
            </TabsContent>
          </Suspense>
        </div>
      </Tabs>
    </div>
  );
}
