import { useEffect, useMemo, useState } from "react";
import {User, UserGet} from "./staffTypes";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    useCreateUser, useGetRole,
    useGetStaff,
    useUpdateUser,
} from "@/components/ApiCall/Api";
import { useGetClinic } from "@/components/ApiCall/Api";
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
import { NiceSelect, Option } from "@/components/ui/NiceSelect"; // import your NiceSelect

const UserTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, refetch } = useGetStaff();
    const { data: role } = useGetRole();
    const { data: clinics } = useGetClinic();
    const [mode, setMode] = useState<"add" | "edit">("add");

    const createUser = useCreateUser();
    const updateUser = useUpdateUser(selectedUser?.id);

    const form = useForm<User & { clinic_ids: number[]; phone: string; gender: string; isActive: boolean }>({
        defaultValues: {
            full_name: "",
            email: "",
            role_id: 2,
            isActive: true,
            clinic_ids: [],
            phone: "",
            gender: "M",
        },
    });

    useEffect(() => {
        if (mode === "edit" && selectedUser) {
            form.reset({
                full_name: selectedUser.full_name,
                email: selectedUser.email,
                role_id: selectedUser.role_id,
                isActive: selectedUser.isActive,
                clinic_ids: selectedUser.clinic_ids || [],
                phone: selectedUser.phone || "",
                gender: selectedUser.gender || "M",
            });
        }
    }, [mode, selectedUser, form]);

    const handleAddUser = () => {
        setMode("add");
        setSelectedUser(null);
        form.reset();
        setIsOpen(true);
    };

    const handleEditUser = (user: any) => {
        setMode("edit");
        setSelectedUser(user);
        setIsOpen(true);
    };

    const generateUsername = (fullName: string) => {
        const firstName = fullName.trim().split(" ")[0];
        const randomNum = Math.floor(100 + Math.random() * 900);
        return `${firstName}${randomNum}`;
    };

    const onSubmit = (data: any) => {
        const payload = {
            full_name: data.full_name,
            email: data.email,
            role_id: data.role_id,
            isActive: data.isActive,
            clinic_ids: data.clinic_ids,
            password: data.password,
            username: generateUsername(data.full_name),
            phone: data.phone,
            gender: data.gender,
        };

        if (mode === "add") {
            createUser.mutate(payload, {
                onSuccess: () => {
                    form.reset();
                    setIsOpen(false);
                    refetch();
                },
            });
        }

        if (mode === "edit" && selectedUser?.id) {
            updateUser.mutate(payload, {
                onSuccess: () => {
                    form.reset();
                    setIsOpen(false);
                    setSelectedUser(null);
                    refetch();
                },
            });
        }
    };

    const columns: Column<UserGet>[] = useMemo(
        () => [
            { header: "Full Name", accessor: "fullName" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "roleName" },
            {
                header: "Status",
                accessor: (row) => (row.isActive ? "Active" : "Inactive"),
            },
            {
                header: "Clinics",
                accessor: (row) => row.clinics?.map(c => c.name).join(", ") || "-",
            },
        ],
        []
    );

    // convert data to NiceSelect options
    const roleOptions: Option<number>[] =
        role?.data?.map((r: any) => ({
            label: r.code,
            value: r.id,
        })) || [];


    const clinicOptions: Option<number>[] =
        clinics?.data?.map((c: any) => ({
            label: c.name,
            value: c.id,
        })) || [];


    const genderOptions: Option<string>[] = [
        { label: "M", value: "M" },
        { label: "F", value: "F" },
    ];


    const statusOptions: Option<boolean>[] = [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Staff Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome to Appointment & Queue Management System
                    </p>
                </div>
                <Button onClick={handleAddUser}>Add Staff</Button>
            </div>

            <Table
                data={data?.data || []}
                columns={columns}
                onEdit={(row) => handleEditUser(row)}
            />

            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        form.reset();
                        setSelectedUser(null);
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] min-w-[60vw] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Staff" : "Update Staff"}
                        </DialogTitle>
                        <DialogClose />
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    rules={{ required: "Full name is required" }}
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

                                {/* Email */}
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

                                {/* Phone */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    rules={{ required: "Phone number is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="Enter phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Gender */}
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

                                {mode === "add" && (
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        rules={{ required: "Password is required" }}
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
                                )}

                                {/* Role */}
                                <Controller
                                    control={form.control}
                                    name="role_id"
                                    render={({ field, fieldState }) => (
                                        <NiceSelect
                                            {...field}

                                            label="Role"
                                            options={roleOptions}
                                            value={roleOptions.find(o => o.value === field.value)}
                                            onChange={val => field.onChange((val as Option).value)}
                                            error={fieldState.error?.message}
                                            disabled={mode === "edit"}
                                        />
                                    )}
                                />

                                {/* Clinic */}
                                <Controller
                                    control={form.control}
                                    name="clinic_ids"
                                    render={({ field, fieldState }) => (
                                        <NiceSelect
                                            {...field}

                                            label="Clinic"
                                            options={clinicOptions}
                                            value={clinicOptions.filter(o => field.value.includes(o.value))}
                                            onChange={val => field.onChange((val as Option[]).map(v => v.value))}
                                            error={fieldState.error?.message}
                                            isMulti
                                        />
                                    )}
                                />

                                {/* Active Status */}
                                <Controller
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <NiceSelect
                                            {...field}

                                            label="Status"
                                            options={statusOptions}
                                            value={statusOptions.find(o => o.value === field.value)}
                                            onChange={val => field.onChange((val as Option).value)}
                                        />
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add"
                                        ? createUser.isPending
                                            ? "Saving..."
                                            : "Save"
                                        : updateUser.isPending
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

export default UserTable;
