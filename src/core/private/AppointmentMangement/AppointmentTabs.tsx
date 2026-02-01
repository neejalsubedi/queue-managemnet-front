import { useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import Appointment from "@/core/private/AppointmentMangement/Appointment.tsx";
import AppointmentHistory from "@/core/private/AppointmentMangement/AppointmentHistory.tsx";


/* 🔑 storage key */
const TAB_KEY = "appointment-active-tab";

/* 🧭 tabs config */
const TABS = [
    // { value: "patient-appointment", label: "Patient Appointment" },
    { value: "appointment", label: "Live Appointment" },
    { value: "history", label: "History" },
];

// const DEFAULT_TAB = "patient-appointment";
const DEFAULT_TAB="appointment"
const AppointmentTabs = () => {
    const isMobile = useIsMobile();

    const [activeTab, setActiveTab] = useState<string>(() => {
        const saved = sessionStorage.getItem(TAB_KEY);
        return TABS.some((t) => t.value === saved) ? saved! : DEFAULT_TAB;
    });

    /* 💾 persist active tab */
    useEffect(() => {
        sessionStorage.setItem(TAB_KEY, activeTab);
    }, [activeTab]);

    /* 🧹 cleanup on unmount */
    useEffect(() => {
        return () => {
            sessionStorage.removeItem(TAB_KEY);
        };
    }, []);

    return (
            <Tabs value={activeTab} defaultValue={DEFAULT_TAB} onValueChange={setActiveTab}>

                {/* ===== HEADER ===== */}


                    {/* 🖥 Desktop Tabs */}
                    {!isMobile && (
                        <TabsList className="flex gap-6 bg-transparent p-2 h-15">
                            {TABS.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="tab-trigger"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    )}

                    {/* 📱 Mobile Dropdown */}
                    {isMobile && (
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                                {TABS.map((tab) => (
                                    <SelectItem
                                        key={tab.value}
                                        value={tab.value}
                                    >
                                        {tab.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}


                {/* ===== CONTENT ===== */}
                <div className="bg-white border border-t-0 rounded-lg">
                    {/*<TabsContent value="patient-appointment" className="p-6">*/}
                    {/*  <span>hhhhh</span>*/}
                    {/*</TabsContent>*/}

                    <TabsContent value="appointment" className="p-6">
                   <Appointment/>
                    </TabsContent>

                    <TabsContent value="history" className="p-6">
                         <AppointmentHistory />
                    </TabsContent>
                </div>
            </Tabs>

    );
};

export default AppointmentTabs;
