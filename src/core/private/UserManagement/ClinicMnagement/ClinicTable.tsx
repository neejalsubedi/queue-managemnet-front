import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Table, { Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    useAddClinic, useDeleteClinic,
    useGetClinic,

    useUpdateClinic,
} from "@/components/ApiCall/Api";

import {Clinic} from "@/core/private/UserManagement/ClinicMnagement/clinicType.ts";



const ClinicTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");

    const { data, refetch } = useGetClinic();

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

    /* Populate form on edit */
    useEffect(() => {
        if (mode === "edit" && selectedClinic) {
            form.reset({
                name: selectedClinic.name,
                address: selectedClinic.address,
                contact: selectedClinic.contact,
            });
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
        if (!clinic.id) return;

        deleteClinic.mutate(clinic.id, {
            onSuccess: () => refetch(),
        });
    };

    const onSubmit = (data: Clinic) => {
        if (mode === "add") {
            addClinic.mutate(data, {
                onSuccess: () => {
                    form.reset();
                    setIsOpen(false);
                    refetch();
                },
            });
        }

        if (mode === "edit" && selectedClinic?.id) {
            updateClinic.mutate(data, {
                onSuccess: () => {
                    form.reset();
                    setIsOpen(false);
                    setSelectedClinic(null);
                    refetch();
                },
            });
        }
    };

    const columns: Column<Clinic>[] = useMemo(
        () => [
            { header: "Clinic Name", accessor: "name" },
            { header: "Address", accessor: "address" },
            { header: "Contact", accessor: "contact" },
        ],
        []
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clinic Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome to Appointment & Queue Management System
                    </p>
                </div>
                <Button onClick={handleAddClinic}>Add Clinic</Button>
            </div>

            <Table
                data={data?.data || []}
                columns={columns}
                onEdit={(row) => handleEditClinic(row)}
                onDelete={(row) => handleDeleteClinic(row)}
            />

            {/* Dialog */}
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        form.reset();
                        setSelectedClinic(null);
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] min-w-[50vw] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Clinic" : "Update Clinic"}
                        </DialogTitle>
                        <DialogClose />
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    rules={{ required: "Clinic name is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Clinic Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter clinic name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contact"
                                    rules={{ required: "Contact is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter contact number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    rules={{ required: "Address is required" }}
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter clinic address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add"
                                        ? addClinic.isPending
                                            ? "Saving..."
                                            : "Save"
                                        : updateClinic.isPending
                                            ? "Updating..."
                                            : "Update"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClinicTable;
