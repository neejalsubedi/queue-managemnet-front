import { useEffect, useMemo, useState } from "react";
import { Patient } from "@/core/private/PatientMangement/type.ts";
import { differenceInYears, parseISO } from "date-fns";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    useAddPatient,
    useGetPatient,
    useUpdatePatient,
    useDeletePatient,
} from "@/components/ApiCall/Api";

import { Button } from "@/components/ui/button";
import Table, { Column } from "@/components/ui/table";
import { useForm, Controller } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { NiceSelect, Option } from "@/components/ui/NiceSelect";

const PatientTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const { data, refetch } = useGetPatient();
    const addPatient = useAddPatient();
    const updatePatient = useUpdatePatient(selectedPatient?.id);
    const deletePatient = useDeletePatient(selectedPatient?.id);
    console.log(selectedPatient)

    const [mode, setMode] = useState<"add" | "edit">("add");

    const form = useForm<Patient>({
        defaultValues: {
            full_name: "",
            username: "",
            email: "",
            password: "",
            phone: "",
            gender: "M",
          dob: "",
            age: null,
            address: "",
            blood_group: "",
            emergency_contact_name: "",
            emergency_contact_phone: "",
        },
    });

    // Reset form when editing
    useEffect(() => {
        if (mode === "edit" && selectedPatient) {
            form.reset(selectedPatient);
        }
    }, [mode, selectedPatient, form]);

    const handleAddPatient = () => {
        setMode("add");
        setSelectedPatient(null);
        form.reset();
        setIsOpen(true);
    };

    const handleEditPatient = (row: Patient) => {
        setMode("edit");
        setSelectedPatient(row);
        setIsOpen(true);
    };

    const handleDeletePatient = (row: Patient) => {
        setSelectedPatient(row);
            deletePatient.mutate(row.id, { // use id for delete
                onSuccess: () => refetch(),
            });

    };

    const generateUsername = (fullName: string) => {
        const firstName = fullName.trim().split(" ")[0];
        const randomNum = Math.floor(100 + Math.random() * 900);
        return `${firstName}${randomNum}`;
    };

    const calculateAge = (dob: string) => {
        if (!dob) return null;
        console.log(differenceInYears(new Date(), parseISO(dob)))
        return differenceInYears(new Date(), parseISO(dob));
    };

    const onSubmit = (data: Patient) => {
        const payload: Patient = {
            ...data,
            username: mode === "add" ? generateUsername(data.full_name) : data.username,
            age: calculateAge(data.dob || ""),

        };

        if (mode === "add") {
            addPatient.mutate(payload, {
                onSuccess: () => {
                    form.reset();
                    setIsOpen(false);
                    refetch();
                },
            });
        }

        if (mode === "edit" && selectedPatient) {
            updatePatient.mutate(payload, {
                onSuccess: () => {
                    form.reset();
                    setIsOpen(false);
                    setSelectedPatient(null);
                    refetch();
                },
            });
        }
    };

    const columns: Column<Patient>[] = useMemo(
        () => [
            { header: "Full Name", accessor: "full_name" },
            { header: "Email", accessor: "email" },
            { header: "Phone", accessor: "phone" },
            { header: "Gender", accessor: "gender" },
            { header: "Blood Group", accessor: "blood_group" },
            { header: "Age", accessor: "age" },

        ],
        []
    );

    const genderOptions: Option[] = [
        { label: "M", value: "M" },
        { label: "F", value: "F" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
                    <p className="text-muted-foreground mt-2">Manage patients in the system</p>
                </div>
                <Button onClick={handleAddPatient}>Add Patient</Button>
            </div>

            <Table data={data?.data || []} columns={columns} onDelete={(row)=>{handleDeletePatient(row)
                setSelectedPatient(row)}  }
                   onEdit={(row)=>{handleEditPatient(row)
                       setSelectedPatient(row)}}/>

            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        form.reset();
                        setSelectedPatient(null);
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] min-w-[60vw] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{mode === "add" ? "Add Patient" : "Update Patient"}</DialogTitle>
                        <DialogClose />
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    rules={{ required: "Full Name is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{ required: "Email is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter email" {...field} />
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
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="Enter phone" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="gender"
                                    render={({ field, fieldState }) => (
                                        <NiceSelect
                                            {...field}
                                            label="Gender"
                                            options={genderOptions}
                                            value={genderOptions.find(o => o.value === field.value)}
                                            onChange={val => field.onChange((val as Option).value)}
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    rules={{ required: mode === "add" ? "Password is required" : undefined }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
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
                                                <Input {...field} placeholder="Enter address" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="blood_group"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Blood Group</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter blood group" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="emergency_contact_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Emergency Contact Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter emergency contact name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="emergency_contact_phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Emergency Contact Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter emergency contact phone" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add"
                                        ? (addPatient.isPending ? "Saving..." : "Save")
                                        : (updatePatient.isPending ? "Updating..." : "Update")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PatientTable;
