import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
    useAddDoctor,
    useDeleteDoctor,
    useGetDoctor,
    useUpdateDoctor,
} from "@/components/ApiCall/Api.ts";

import DoctorShiftDialog from "./DoctorShiftDialog";
import { Doctor } from "./doctorTypes";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { cn } from "@/lib/utils";
import {
    Mail,
    MoreVertical,
    Phone,
    Stethoscope,
    UserRound,
    Clock,
    Building2,
    Layers,
    Calendar,
    Edit2,
    Trash2,
    Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Table, { Column } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card.tsx";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { ChevronRight } from "lucide-react";

type Props = {
    departmentId: number;
};

const DoctorTable = ({ departmentId }: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [openShift, setOpenShift] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const { data, refetch, isLoading } = useGetDoctor(departmentId);
    const doctors: Doctor[] = data?.data || [];

    const clinicName = doctors.length > 0 ? doctors[0]?.clinic_name : null;
    const departmentName = doctors.length > 0 ? doctors[0]?.department_name : null;

    const addDoctor = useAddDoctor();
    const updateDoctor = useUpdateDoctor(selectedDoctor?.id);
    const deleteDoctor = useDeleteDoctor(selectedDoctor?.id, selectedDoctor?.department_id);

    const form = useForm<Doctor>({
        defaultValues: {
            department_id: departmentId,
            name: "",
            phone: "",
            email: "",
        },
    });

    useEffect(() => {
        form.reset({
            department_id: departmentId,
            name: selectedDoctor?.name || "",
            phone: selectedDoctor?.phone || "",
            email: selectedDoctor?.email || "",
        });
    }, [departmentId, selectedDoctor, form]);


    const handleAddDoctor = () => {
        setMode("add");
        setSelectedDoctor(null);
        form.reset({
            department_id: departmentId,
            name: "",
            phone: "",
            email: "",
        });
        setOpen(true);
    };

    const handleEditDoctor = (doctor: Doctor) => {
        setMode("edit");
        setSelectedDoctor(doctor);
        setOpen(true);
    };

    const handleDeleteDoctor = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteDoctor = () => {
        if (!selectedDoctor?.id || selectedDoctor?.department_id == null) return;
        deleteDoctor.mutate(undefined, {
            onSuccess: () => {
                setSelectedDoctor(null);
                setDeleteConfirmOpen(false);
                refetch();
            },
        });
    };

    const onSubmit = (values: Doctor) => {
        const payload = {
            department_id: [departmentId],
            name: values.name,
            phone: values.phone,
            email: values.email,
        };

        const action = mode === "add"
            ? addDoctor.mutate
            : updateDoctor.mutate;

        action(payload, {
            onSuccess: () => {
                setOpen(false);
                setSelectedDoctor(null);
                form.reset({
                    department_id: departmentId,
                    name: "",
                    phone: "",
                    email: "",
                });
                refetch();
            },
        });
    };

    const filteredDoctors = doctors.filter(
        (doctor): doctor is Doctor & { id: number | string } => {
            return !!doctor.id;
        }
    );

    const columns: Column<Doctor & { id: number | string }>[] = [
        {
            header: "Doctor Name",
            accessor: (doctor: Doctor) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <UserRound className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <div className="font-medium text-sm text-foreground">
                            {doctor.name}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Department",
            accessor: (doctor: Doctor) => (
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {doctor.department_name || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            header: "Clinic",
            accessor: (doctor: Doctor) => (
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {doctor.clinic_name || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            header: "Contact Info",
            accessor: (doctor: Doctor) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground truncate max-w-[200px]">
                            {doctor.email}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{doctor.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            header: "Today's Schedule",
            accessor: (doctor: Doctor) => (
                <div className="space-y-1">
                    {doctor.is_day_off ? (
                        <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800"
                        >
                            Day Off
                        </Badge>
                    ) : doctor.today_start_time && doctor.today_end_time ? (
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {doctor.today_start_time} - {doctor.today_end_time}
                            </span>
                        </div>
                    ) : (
                        <span className="text-sm text-muted-foreground">No schedule</span>
                    )}
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (doctor: Doctor) => (
                <Badge
                    variant="outline"
                    className={cn(
                        doctor.is_day_off
                            ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800"
                            : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                    )}
                >
                    {doctor.is_day_off ? "Off" : "Active"}
                </Badge>
            ),
        },
        {
            header: "Actions",
            accessor: (doctor: Doctor) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedDoctor(doctor);
                                setOpenShift(true);
                            }}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Allocate Shift
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteDoctor(doctor)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];


    return (
        <div className="space-y-2">
            <div className="flex justify-between items-start px-1">
                <div className="flex items-start gap-3 flex-1">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        <Stethoscope className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                            Doctors
                        </h2>
                        {(clinicName || departmentName) ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="font-medium">{clinicName || "Clinic"}</span>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                                <div className="flex items-center gap-1.5">
                                    <Layers className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="font-medium">{departmentName || "Department"}</span>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-foreground font-semibold">Doctors</span>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Manage doctors in this department
                            </p>
                        )}
                    </div>
                </div>

                <Card
                    onClick={handleAddDoctor}
                    className={cn(
                        "cursor-pointer transition-all duration-200 border-2 border-dashed group flex-shrink-0",
                        "border-emerald-400/40 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1",
                        "bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-500/5",
                        "hover:from-emerald-500/25 hover:via-emerald-500/15 hover:to-emerald-500/10",
                        "min-w-[140px]"
                    )}
                >
                    <CardContent className="p-3 flex items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-md flex items-center justify-center bg-emerald-600 text-white group-hover:scale-110 transition-all shadow-md">
                            <Plus className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                            Add Doctor
                        </span>
                    </CardContent>
                </Card>
            </div>

            {isLoading ? (
                <div className="border rounded-lg p-6">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : filteredDoctors.length > 0 ? (
                <div className="border rounded-lg shadow-sm bg-card">
                    <Table
                        data={filteredDoctors}
                        columns={columns}
                        searchable={false}
                        pagination={true}
                        emptyText="No doctors found"
                        fitToViewport={true}
                    />
                </div>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Stethoscope className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Doctors Found</h3>
                        <p className="text-muted-foreground text-sm text-center max-w-sm mb-4">
                            {clinicName && departmentName
                                ? `No doctors in ${departmentName} department at ${clinicName} yet. Add a doctor to get started.`
                                : "This department doesn't have any doctors yet. Add a doctor to get started."
                            }
                        </p>
                        <Card
                            onClick={handleAddDoctor}
                            className={cn(
                                "cursor-pointer transition-all duration-200 border-2 border-dashed group",
                                "border-emerald-400/40 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1",
                                "bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-500/5",
                                "hover:from-emerald-500/25 hover:via-emerald-500/15 hover:to-emerald-500/10",
                                "min-w-[140px]"
                            )}
                        >
                            <CardContent className="p-3 flex items-center justify-center gap-2">
                                <div className="h-6 w-6 rounded-md flex items-center justify-center bg-emerald-600 text-white group-hover:scale-110 transition-all shadow-md">
                                    <Plus className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                    Add Doctor
                                </span>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Doctor" : "Update Doctor"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    rules={{ required: "Doctor name is required" }}
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Doctor Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Dr. John Doe"
                                                    disabled={addDoctor.isPending || updateDoctor.isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    {...field}
                                                    placeholder="doctor@example.com"
                                                    disabled={addDoctor.isPending || updateDoctor.isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    rules={{ required: "Phone is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="+977-98..."
                                                    disabled={addDoctor.isPending || updateDoctor.isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={addDoctor.isPending || updateDoctor.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={addDoctor.isPending || updateDoctor.isPending}
                                >
                                    {addDoctor.isPending || updateDoctor.isPending ? (
                                        <span className="flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            {mode === "add" ? "Adding..." : "Updating..."}
                                        </span>
                                    ) : mode === "add" ? (
                                        "Add Doctor"
                                    ) : (
                                        "Update Doctor"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {selectedDoctor && (
                <DoctorShiftDialog
                    open={openShift}
                    onClose={() => {
                        setOpenShift(false);
                        setSelectedDoctor(null);
                    }}
                    doctor={selectedDoctor}
                    onSuccess={() => {
                        refetch();
                    }}
                />
            )}

            <ConfirmModal
                open={deleteConfirmOpen}
                title="Delete doctor"
                description={
                    selectedDoctor ? (
                        <>Are you sure you want to delete <strong>{selectedDoctor.name}</strong>? This action cannot be undone.</>
                    ) : null
                }
                onClose={() => {
                    setDeleteConfirmOpen(false);
                    setSelectedDoctor(null);
                }}
                onConfirm={confirmDeleteDoctor}
                confirmText="Delete"
                confirmLoading={deleteDoctor.isPending}
                actionType="delete"
            />
        </div>
    );
};

export default DoctorTable;
