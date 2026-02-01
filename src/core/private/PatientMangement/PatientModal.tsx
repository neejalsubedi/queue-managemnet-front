// src/components/patient/PatientModal.tsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { differenceInYears, parseISO } from "date-fns";

import { Patient } from "@/core/private/PatientMangement/type";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

import {
    useAddPatient,
    useUpdatePatient,
} from "@/components/ApiCall/Api";

type PatientModalProps = {
    open: boolean;
    mode: "add" | "edit";
    patient?: Patient | null;
    onClose: () => void;
    onSuccess: (newPatientId?: number) => void;
};

const genderOptions: Option[] = [
    { label: "M", value: "M" },
    { label: "F", value: "F" },
];

const calculateAge = (dob?: string | null) => {
    if (!dob) return null;
    return differenceInYears(new Date(), parseISO(dob));
};

const generateUsername = (fullName: string) => {
    const firstName = fullName.trim().split(" ")[0];
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${firstName}${randomNum}`;
};

export const PatientModal = ({
                                 open,
                                 mode,
                                 patient,
                                 onClose,
                                 onSuccess,
                             }: PatientModalProps) => {
    const addPatient = useAddPatient();
    const updatePatient = useUpdatePatient(patient?.id);

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

    // Reset on edit / add
    useEffect(() => {
        if (mode === "edit" && patient) {
            form.reset(patient);
        }
        if (mode === "add") {
            form.reset();
        }
    }, [mode, patient, form]);

    const onSubmit = (data: Patient) => {
        const payload: Patient = {
            ...data,
            username:
                mode === "add"
                    ? generateUsername(data.full_name)
                    : data.username,
            age: calculateAge(data.dob),
        };

        if (mode === "add") {
            addPatient.mutate(payload, {
                onSuccess: (res) => {
                    const newPatientId = res?.data?.data;
                    console.log("modal id",newPatientId)// 👈 extract id
                    form.reset();
                    onSuccess(newPatientId);             // 👈 pass id upward
                    onClose();
                },
            });
        }


        if (mode === "edit" && patient) {
            updatePatient.mutate(payload, {
                onSuccess: () => {
                    form.reset();
                    onSuccess();
                    onClose();
                },
            });
        }
    };

    const isLoading =
        mode === "add" ? addPatient.isPending : updatePatient.isPending;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] min-w-[60vw] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Add Patient" : "Update Patient"}
                    </DialogTitle>
                    <DialogClose />
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="full_name"
                                rules={{ required: "Full Name is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <Input type="email" {...field} />
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <NiceSelect
                                        name={"gender"}
                                        label="Gender"
                                        options={genderOptions}
                                        value={genderOptions.find(
                                            (o) => o.value === field.value
                                        )}
                                        onChange={(opt) =>
                                            field.onChange(
                                                (opt as Option)?.value
                                            )
                                        }
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                rules={{
                                    required:
                                        mode === "add"
                                            ? "Password is required"
                                            : false,
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                {...field}
                                            />
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
                                            <Input
                                                type="date"
                                                {...field}
                                            />
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? mode === "add"
                                        ? "Saving..."
                                        : "Updating..."
                                    : mode === "add"
                                        ? "Save"
                                        : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
