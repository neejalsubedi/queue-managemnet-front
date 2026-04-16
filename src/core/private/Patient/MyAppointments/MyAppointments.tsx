import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile.tsx";
import BookingFlow from "./BookingFlow";
import LiveAppointment from "./LiveAppointment";
import UpcomingAppointments from "./UpcomingAppointments";
import AppointmentHistory from "./AppointmentHistory";
import { Calendar, Clock, History, Plus } from "lucide-react";

const TABS = [
  { value: "book", label: "Book Appointment", icon: Plus },
  { value: "live", label: "Live", icon: Clock },
  { value: "upcoming", label: "Upcoming", icon: Calendar },
  { value: "history", label: "History", icon: History },
];

const TAB_VALUES = TABS.map((t) => t.value);
const DEFAULT_TAB = "book";

export default function MyAppointments() {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return tab && TAB_VALUES.includes(tab) ? tab : DEFAULT_TAB;
  }, [searchParams]);

  const setActiveTab = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", value);
        return next;
      },
      { replace: true }
    );
  };

  const handleBookingSuccess = () => {
    // Switch to upcoming tab after successful booking
    setTimeout(() => setActiveTab("upcoming"), 1000);
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">My Appointments</h1>
        <p className="text-muted-foreground mt-2">
          Manage and book your appointments
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {!isMobile ? (
          <TabsList className="w-full justify-start">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        ) : (
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <SelectItem key={tab.value} value={tab.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        {/* Tab Contents */}
        <div className="mt-6">
          <TabsContent value="book" className="mt-0">
            <BookingFlow onSuccess={handleBookingSuccess} />
          </TabsContent>

          <TabsContent value="live" className="mt-0">
            <LiveAppointment />
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            <UpcomingAppointments />
          </TabsContent>

          <TabsContent value="history" className="mt-0 w-full max-w-full min-w-0 overflow-hidden">
            <AppointmentHistory />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
