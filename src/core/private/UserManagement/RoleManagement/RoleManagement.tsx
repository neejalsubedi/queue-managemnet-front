import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
    useAddRole,
    useGetRole,
    useUpdateRole,
} from "@/components/ApiCall/Api";

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
import { RoleRequest, RoleResponse } from "./roleTypes";
import {useNavigate} from "react-router-dom";

const RoleManagement = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);

    const { data, refetch } = useGetRole();
    const addRole = useAddRole();
    const updateRole = useUpdateRole(selectedRole?.id);

    const form = useForm<RoleRequest>({
        defaultValues: {
            name: "",
            code: "",
            description: "",
        },
    });
const navigate=useNavigate();
    /* Populate form on edit */
    useEffect(() => {
        if (mode === "edit" && selectedRole) {
            form.reset({
                name: selectedRole.name,
                code: selectedRole.code,
                description: selectedRole.description,
            });
        }
    }, [mode, selectedRole, form]);

    const handleAdd = () => {
        setMode("add");
        setSelectedRole(null);
        form.reset();
        setIsOpen(true);
    };

    const handleEdit = (role: RoleResponse) => {
        setMode("edit");
        setSelectedRole(role);
        setIsOpen(true);
    };

    const onSubmit = (data: RoleRequest) => {
        if (mode === "add") {
            addRole.mutate(data, {
                onSuccess: () => {
                    setIsOpen(false);
                    form.reset();
                    refetch();
                },
            });
        }

        if (mode === "edit" && selectedRole?.id) {
            updateRole.mutate(data, {
                onSuccess: () => {
                    setIsOpen(false);
                    setSelectedRole(null);
                    form.reset();
                    refetch();
                },
            });
        }
    };

    const columns: Column<RoleResponse>[] = useMemo(
        () => [
            { header: "Role Name", accessor: "name" },
            { header: "Code", accessor: "code" },
            { header: "Description", accessor: "description" },
        ],
        []
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Role Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Create and manage user roles
                    </p>
                </div>
                <Button onClick={handleAdd}>Add Role</Button>
            </div>

            <Table
                data={data?.data || []}
                columns={columns}
                onEdit={(row) => handleEdit(row)}
                onPermission={(row) => navigate(`/role-management/permissions/${row.id}`,{state:{role_name:row.name,code:row.code}})}
            />

            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        form.reset();
                        setSelectedRole(null);
                    }
                }}
            >
                <DialogContent className="min-w-[50vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Role" : "Update Role"}
                        </DialogTitle>
                        <DialogClose />
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
                                    rules={{ required: "Role name is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Admin" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="code"
                                    rules={{ required: "Code is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ADMIN" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="System administrator role"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add"
                                        ? addRole.isPending
                                            ? "Saving..."
                                            : "Save"
                                        : updateRole.isPending
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

export default RoleManagement;
