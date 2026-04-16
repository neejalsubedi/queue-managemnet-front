import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
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
    useAddClinic,
    useDeleteClinic,
    useGetClinic,
    useUpdateClinic,
} from "@/components/ApiCall/Api.ts";


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { Building2, MapPin, MoreVertical, Phone, Edit2, Trash2, Plus } from "lucide-react";
import { Clinic } from "./clinicType";
import Department from "./DepartmentManagement/Department";
import DoctorTable from "./DoctorManagement/DoctorTable";



const ClinicTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(null);

    const { data, refetch } = useGetClinic();
    const clinics: Clinic[] = data?.data || [];

    const [activeClinicId, setActiveClinicId] = useState<number | string | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);


    const addClinic = useAddClinic();
    const updateClinic = useUpdateClinic(selectedClinic?.id);
    const deleteClinic = useDeleteClinic(selectedClinic?.id);

    const form = useForm<Clinic>({
        defaultValues: {
            name: "",
            address: "",
            contact: "",
        },
    });

    useEffect(() => {
        if (mode === "edit" && selectedClinic) {
            form.reset(selectedClinic);
        }
    }, [mode, selectedClinic, form]);

    const handleAddClinic = () => {
        setMode("add");
        setSelectedClinic(null);
        form.reset();
        setIsOpen(true);
    };

    const handleEditClinic = (clinic: Clinic) => {
        setMode("edit");
        setSelectedClinic(clinic);
        setIsOpen(true);
    };

    const handleDeleteClinic = (clinic: Clinic) => {
        setSelectedClinic(clinic);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteClinic = () => {
        if (!selectedClinic?.id) return;
        deleteClinic.mutate(undefined, {
            onSuccess: () => {
                setDeleteConfirmOpen(false);
                setSelectedClinic(null);
                refetch();
            },
        });
    };
    const handleClinicClick = (clinic: Clinic) => {
        setActiveClinicId(clinic.id ?? null);
        setActiveDepartmentId(null); // reset downstream
    };

    useEffect(() => {
        if (clinics.length > 0 && !activeClinicId) {
            setActiveClinicId(clinics[0].id ?? null);
        }
    }, [clinics, activeClinicId]);

    const onSubmit = (data: Clinic) => {
        const action =
            mode === "add"
                ? addClinic.mutate
                : updateClinic.mutate;

        action(data, {
            onSuccess: () => {
                setIsOpen(false);
                setSelectedClinic(null);
                form.reset();
                refetch();
            },
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Clinic Management</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Manage clinics, departments, and doctors efficiently.
                </p>
            </div>

            {/* Clinic Section */}
            <div className="border-b-2 border-muted-foreground/20 dark:border-muted-foreground/30 pb-4">
                {clinics.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Select Clinic
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                ({clinics.length} {clinics.length === 1 ? 'clinic' : 'clinics'})
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-center">
                            {clinics.map((clinic) => (
                                <Card
                                    key={clinic.id}
                                    onClick={() => handleClinicClick(clinic)}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 border-2 group",
                                        activeClinicId === clinic.id
                                            ? "border-primary shadow-lg ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10"
                                            : "border-border hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
                                    )}
                                >
                                    <CardContent className="p-2.5">
                                        <div className="flex items-start justify-between mb-1.5">
                                            <div className={cn(
                                                "h-7 w-7 rounded-md flex items-center justify-center transition-colors flex-shrink-0",
                                                activeClinicId === clinic.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                            )}>
                                                <Building2 className="h-3.5 w-3.5" />
                                            </div>
                                            {activeClinicId === clinic.id && (
                                                <div className="w-full text-center border-b border-primary/20">
                                                    <span className="text-xs font-medium text-primary">
                                                        Selected
                                                    </span>
                                                </div>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={cn(
                                                            "h-6 w-6 -mr-1",
                                                            activeClinicId === clinic.id
                                                                ? "text-primary hover:bg-primary/10"
                                                                : "text-muted-foreground hover:text-foreground"
                                                        )}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <MoreVertical className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditClinic(clinic)}>
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClinic(clinic);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className={cn(
                                                "font-semibold text-sm leading-tight line-clamp-1",
                                                activeClinicId === clinic.id && "text-primary"
                                            )}>
                                                {clinic.name}
                                            </h3>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1  text-muted-foreground">
                                                    <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                                                    <span className="line-clamp-1 text-xs">{clinic.address || "No address"}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Phone className="h-2.5 w-2.5 flex-shrink-0" />
                                                    <span className="text-xs">{clinic.contact || "No contact"}</span>
                                                </div>
                                            </div>
                                        </div>


                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add Clinic Card */}
                            <Card
                                onClick={handleAddClinic}
                                className={cn(
                                    "cursor-pointer transition-all duration-200 border-2 border-dashed group",
                                    "border-primary/40 hover:border-primary hover:shadow-lg hover:-translate-y-1",
                                    "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 hover:from-primary/25 hover:via-primary/15 hover:to-primary/10",
                                    "w-24 h-full"
                                )}
                            >
                                <CardContent className="p-2.5 flex flex-col items-center justify-center h-full">
                                    <div className="h-7 w-7 rounded-md flex items-center justify-center bg-primary text-primary-foreground group-hover:scale-110 transition-all mb-1.5 shadow-md">
                                        <Plus className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold text-primary group-hover:text-primary/90 transition-colors">
                                        Add Clinic
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Building2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Clinics Found</h3>
                            <p className="text-muted-foreground text-sm text-center max-w-sm mb-4">
                                Start by adding a new clinic to the system.
                            </p>
                            <Button onClick={handleAddClinic} className="gap-2">
                                <Building2 className="h-4 w-4" />
                                Add Clinic
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Department Section */}
            {activeClinicId && (
                <div className="border-b-2 border-muted-foreground/20 dark:border-muted-foreground/30 pb-4">
                    <Department
                        clinicId={activeClinicId}
                        onSelectDepartment={setActiveDepartmentId}
                    />
                </div>
            )}

            {/* Doctor Section */}
            {activeDepartmentId !== null && (
                <div className="relative">
                    <DoctorTable departmentId={activeDepartmentId} />
                </div>
            )}


            {/* Clinic Dialog (unchanged) */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Clinic" : "Update Clinic"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Clinic Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. City Central Clinic" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="+977-98..." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Street, City" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add" ? "Save Clinic" : "Update Clinic"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <ConfirmModal
                open={deleteConfirmOpen}
                title="Delete clinic"
                description={
                    selectedClinic ? (
                        <>Are you sure you want to delete <strong>{selectedClinic.name}</strong>? This action cannot be undone.</>
                    ) : null
                }
                onClose={() => {
                    setDeleteConfirmOpen(false);
                    setSelectedClinic(null);
                }}
                onConfirm={confirmDeleteClinic}
                confirmText="Delete"
                confirmLoading={deleteClinic.isPending}
                actionType="delete"
            />
        </div>
    );
};

export default ClinicTable;
