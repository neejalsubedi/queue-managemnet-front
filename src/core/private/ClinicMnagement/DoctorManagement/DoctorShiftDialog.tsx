import {useEffect, useMemo, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

import { ImCross } from "react-icons/im";
import {
    useSaveDoctorShift,
    useGetDoctorShift,
} from "@/components/ApiCall/Api.ts";
import { Doctor } from "@/core/private/ClinicMnagement/DoctorManagement/doctorTypes.tsx";

/* ---------- TYPES ---------- */

const toAmPm = (time24: string): string => {
    if (!time24) return "";

    const [h, m] = time24.split(":").map(Number);
    const modifier = h >= 12 ? "PM" : "AM";
    const hours = h % 12 === 0 ? 12 : h % 12;

    return `${hours}:${m.toString().padStart(2, "0")} ${modifier}`;
};

// ✅ ADDED (DB → input[type=time])
const to24Hour = (time?: string | null): string => {
    if (!time) return "";

    // Handles "2:16 PM"
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
};

type ApiDoctorShift = {
    day_of_week: number;
    start_time: string | null;
    end_time: string | null;
    is_day_off: boolean;
};

type Shift = {
    start_time: string;
    end_time: string;
    is_day_off: boolean;
};

type DayShift = {
    day_of_week: number;
    shifts: Shift[];
};

/* ---------- CONSTANTS ---------- */

const DAYS = [
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
    { id: 7 , label: "Sunday" },
];

/* ---------- COMPONENT ---------- */

const DoctorShiftDialog = ({
                               open,
                               onClose,
                               doctor,
                           }: {
    open: boolean;
    onClose: () => void;
    doctor: Doctor;
}) => {
    const saveShift = useSaveDoctorShift(
        doctor.id,
        doctor.department_id
    );

    // ✅ ADDED
    const { data } = useGetDoctorShift(
        doctor.id,
        doctor.department_id
    );

    const savedShifts = useMemo<ApiDoctorShift[]>(
        () => data?.data ?? [],
        [data?.data]
    );



    const [days, setDays] = useState<DayShift[]>([]);

    /* ---------- INIT (WITH PREFILL) ---------- */
    useEffect(() => {
        const baseDays: DayShift[] = DAYS.map((d) => ({
            day_of_week: d.id,
            shifts: [],
        }));

        if (savedShifts.length === 0) {
            // 👇 No data → show one empty shift per day
            baseDays.forEach((day) => {
                day.shifts.push({
                    start_time: "",
                    end_time: "",
                    is_day_off: false,
                });
            });

            setDays(baseDays);
            return;
        }

        // 👇 Prefill from API
        for (const day of baseDays) {
            const shiftsForDay = savedShifts.filter(
                (s) => s.day_of_week === day.day_of_week
            );

            if (shiftsForDay.length === 0) {
                day.shifts.push({
                    start_time: "",
                    end_time: "",
                    is_day_off: false,
                });
            } else {
                shiftsForDay.forEach((s) => {
                    day.shifts.push({
                        start_time: to24Hour(s.start_time),
                        end_time: to24Hour(s.end_time),
                        is_day_off: s.is_day_off,
                    });
                });
            }
        }

        setDays(baseDays);
    }, [ doctor.id, doctor.department_id],doctor.name);


    /* ---------- HANDLERS ---------- */

    const toggleDayOff = (day: number) => {
        setDays((prev) =>
            prev.map((d) => {
                if (d.day_of_week !== day) return d;

                const isCurrentlyDayOff = d.shifts[0]?.is_day_off;

                // 🔁 Reverse: Day Off → Working day
                if (isCurrentlyDayOff) {
                    return {
                        ...d,
                        shifts: [
                            {
                                start_time: "",
                                end_time: "",
                                is_day_off: false,
                            },
                        ],
                    };
                }

                // 🚫 Working day → Day Off
                return {
                    ...d,
                    shifts: [
                        {
                            start_time: "",
                            end_time: "",
                            is_day_off: true,
                        },
                    ],
                };
            })
        );
    };

    const addShift = (day: number) => {
        setDays((prev) =>
            prev.map((d) =>
                d.day_of_week === day
                    ? {
                        ...d,
                        shifts: [
                            ...d.shifts,
                            {
                                start_time: "",
                                end_time: "",
                                is_day_off: false,
                            },
                        ],
                    }
                    : d
            )
        );
    };

    const removeShift = (day: number, index: number) => {
        setDays((prev) =>
            prev.map((d) =>
                d.day_of_week === day
                    ? {
                        ...d,
                        shifts: d.shifts.filter(
                            (_, i) => i !== index
                        ),
                    }
                    : d
            )
        );
    };

    const updateShift = (
        day: number,
        index: number,
        field: "start_time" | "end_time",
        value: string
    ) => {
        setDays((prev) =>
            prev.map((d) => {
                if (d.day_of_week !== day) return d;
                const shifts = [...d.shifts];
                shifts[index] = {
                    ...shifts[index],
                    [field]: value,
                };
                return { ...d, shifts };
            })
        );
    };

    /* ---------- SAVE ---------- */

    const handleSave = () => {
        const shifts = days.flatMap((d) =>
            d.shifts
                .filter((s) => {
                    if (s.is_day_off) return true;
                    if (!s.start_time || !s.end_time) return false;
                    return true;
                })
                .map((s) => ({
                    day_of_week: d.day_of_week,
                    is_day_off: s.is_day_off,
                    start_time: s.is_day_off
                        ? undefined
                        : toAmPm(s.start_time),
                    end_time: s.is_day_off
                        ? undefined
                        : toAmPm(s.end_time),
                }))
        );

        if (shifts.length === 0) {
            alert("Please add at least one valid shift");
            return;
        }

        saveShift.mutate(
            { shifts },
            { onSuccess: () => onClose() }
        );
    };

    /* ---------- UI ---------- */

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="min-w-[60vw]">
                <DialogHeader>
                    <DialogTitle>
                        Allocate Shifts – {doctor.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {DAYS.map((day) => {
                        const dayData = days.find(
                            (d) => d.day_of_week === day.id
                        );
                        if (!dayData) return null;

                        const isDayOff =
                            dayData.shifts[0]?.is_day_off;

                        return (
                            <div
                                key={day.id}
                                className="border rounded-lg p-4"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold">
                                        {day.label}
                                    </h4>

                                    <Button
                                        size="sm"
                                        variant={
                                            isDayOff
                                                ? "destructive"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            toggleDayOff(day.id)
                                        }
                                    >
                                        {isDayOff
                                            ? "Day Off"
                                            : "Mark Day Off"}
                                    </Button>
                                </div>

                                {!isDayOff && (
                                    <>
                                        {dayData.shifts.map(
                                            (shift, i) => (
                                                <div
                                                    key={i}
                                                    className="flex gap-2 items-center mb-2"
                                                >
                                                    <Input
                                                        name={"start_time"}
                                                        type="time"
                                                        value={
                                                            shift.start_time
                                                        }
                                                        onChange={(e) =>
                                                            updateShift(
                                                                day.id,
                                                                i,
                                                                "start_time",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    <Input
                                                        name={"end_time"}
                                                        type="time"
                                                        value={
                                                            shift.end_time
                                                        }
                                                        onChange={(e) =>
                                                            updateShift(
                                                                day.id,
                                                                i,
                                                                "end_time",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    <ImCross
                                                        className="text-red-500 cursor-pointer"
                                                        onClick={() =>
                                                            removeShift(
                                                                day.id,
                                                                i
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}

                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                addShift(day.id)
                                            }
                                        >
                                            Add Shift
                                        </Button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Shifts
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DoctorShiftDialog;
