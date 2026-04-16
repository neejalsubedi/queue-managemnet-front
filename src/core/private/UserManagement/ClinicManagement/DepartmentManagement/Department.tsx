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
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
    useAddDepartment,
    useDeleteDepartment,
    useGetDepartment,
    useUpdateDepartment,
} from "@/components/ApiCall/Api.ts";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { Layers, MoreVertical, Plus, Edit2, Trash2 } from "lucide-react";

/* ================= TYPES ================= */

type Department = {
    id?: number;
    clinic_id: number | string;
    name: string;
};

type DepartmentProps = {
    clinicId: number | string;
    onSelectDepartment: (id: number | null) => void;
};

/* ================= COMPONENT ================= */

const Department = ({ clinicId, onSelectDepartment }: DepartmentProps) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Department | null>(null);
    const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

    const { data, refetch, isLoading } = useGetDepartment(clinicId) as any;
    const departments: Department[] = data?.data || [];

    const addDepartment = useAddDepartment();
    const updateDepartment = useUpdateDepartment(selected?.id);
    const deleteDepartment = useDeleteDepartment(departmentToDelete?.id);

    const form = useForm<Department>({
        defaultValues: {
            clinic_id: clinicId,
            name: "",
        },
    });

    /* ================= EFFECTS ================= */

    useEffect(() => {
        if (departments.length > 0) {
            const firstDept = departments[0];
            if (firstDept.id) {
                setActiveDepartmentId(firstDept.id);
                onSelectDepartment(firstDept.id);
            }
        } else {
            setActiveDepartmentId(null);
            onSelectDepartment(null);
        }
    }, [departments, clinicId]);

    useEffect(() => {
        form.reset({
            clinic_id: clinicId,
            name: selected?.name || "",
        });
    }, [clinicId, selected, form]);

    useEffect(() => {
        setActiveDepartmentId(null);
    }, [clinicId]);

    /* ================= HANDLERS ================= */

    const handleDepartmentClick = (dept: Department) => {
        if (!dept.id) return;
        setActiveDepartmentId(dept.id);
        onSelectDepartment(dept.id);
    };

    const onSubmit = (values: Department) => {
        const payload = {
            clinic_id: clinicId,
            name: values.name,
        };

        const action = selected
            ? updateDepartment.mutate
            : addDepartment.mutate;

        action(payload, {
            onSuccess: () => {
                setOpen(false);
                setSelected(null);
                refetch();
            },
        });
    };

    const confirmDeleteDepartment = () => {
        if (!departmentToDelete?.id) return;
        deleteDepartment.mutate(undefined, {
            onSuccess: () => {
                if (activeDepartmentId === departmentToDelete.id) {
                    setActiveDepartmentId(null);
                    onSelectDepartment(null);
                }
                setDeleteConfirmOpen(false);
                setDepartmentToDelete(null);
                refetch();
            },
        });
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 px-1">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Layers className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Departments
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Select a department to view doctors
                    </p>
                </div>
            </div>

            {/* Departments Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-2">
                                <div className="h-6 w-6 rounded-md bg-muted mb-1" />
                                <div className="h-3 w-full bg-muted rounded mt-1.5" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : departments.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {departments.map((dept) => (
                        <Card
                            key={dept.id}
                            onClick={() => handleDepartmentClick(dept)}
                            className={cn(
                                "cursor-pointer transition-all duration-200 border-2 group",
                                activeDepartmentId === dept.id
                                    ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20"
                                    : "border-border hover:border-blue-300 hover:shadow-md hover:-translate-y-1"
                            )}
                        >
                            <CardContent className="p-2">
                                <div className="flex items-start justify-between mb-1.5">
                                    <div className={cn(
                                        "h-6 w-6 rounded-md flex items-center justify-center transition-colors flex-shrink-0",
                                        activeDepartmentId === dept.id
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
                                    )}>
                                        <Layers className="h-3 w-3" />
                                    </div>
                                    {activeDepartmentId === dept.id && (
                                        <div className="w-full text-center border-b border-blue-200 dark:border-blue-800">
                                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
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
                                                    "h-5 w-5 -mr-1 -mt-0.5",
                                                    activeDepartmentId === dept.id
                                                        ? "text-blue-600 hover:bg-blue-100"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="h-2.5 w-2.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelected(dept);
                                                    setOpen(true);
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDepartmentToDelete(dept);
                                                    setDeleteConfirmOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-0.5">
                                    <h3 className={cn(
                                        "font-semibold text-sm leading-tight line-clamp-2",
                                        activeDepartmentId === dept.id && "text-blue-700 dark:text-blue-300"
                                    )}>
                                        {dept.name}
                                    </h3>
                                </div>


                            </CardContent>
                        </Card>
                    ))}

                    {/* Add Department Card */}
                    <Card
                        onClick={() => {
                            setSelected(null);
                            setOpen(true);
                        }}
                        className={cn(
                            "cursor-pointer transition-all duration-200 border-2 border-dashed group",
                            "border-blue-400/40 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1",
                            "bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-blue-500/5 hover:from-blue-500/25 hover:via-blue-500/15 hover:to-blue-500/10",
                            "w-24 h-full"
                        )}
                    >
                        <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                            <div className="h-6 w-6 rounded-md flex items-center justify-center bg-blue-600 text-white group-hover:scale-110 transition-all mb-1 shadow-md">
                                <Plus className="h-3 w-3" />
                            </div>
                            <span className="text-[10px] font-semibold text-blue-600 group-hover:text-blue-700 transition-colors text-center">
                                Add Department
                            </span>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Layers className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">No Departments</h3>
                        <p className="text-muted-foreground text-xs text-center max-w-xs mb-3">
                            No departments in this clinic yet.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelected(null);
                                setOpen(true);
                            }}
                            className="gap-2"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Department
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* ================= DIALOG ================= */}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Update Department" : "Add Department"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. Cardiology" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={addDepartment.isPending || updateDepartment.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={addDepartment.isPending || updateDepartment.isPending}
                                >
                                    {addDepartment.isPending || updateDepartment.isPending ? (
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
                                            {selected ? "Updating..." : "Adding..."}
                                        </span>
                                    ) : selected ? (
                                        "Update Department"
                                    ) : (
                                        "Save Department"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <ConfirmModal
                open={deleteConfirmOpen}
                title="Delete department"
                description={
                    departmentToDelete ? (
                        <>Are you sure you want to delete <strong>{departmentToDelete.name}</strong>? This action cannot be undone.</>
                    ) : null
                }
                onClose={() => {
                    setDeleteConfirmOpen(false);
                    setDepartmentToDelete(null);
                }}
                onConfirm={confirmDeleteDepartment}
                confirmText="Delete"
                confirmLoading={deleteDepartment.isPending}
                actionType="delete"
            />
        </div>
    );
};

export default Department;
