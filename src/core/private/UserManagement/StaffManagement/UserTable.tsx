// import { Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { User } from "./staffTypes";

// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { Form } from "@/components/ui/form";
// // import { GenericFormRenderer } from "@/components/form/GenericFormRenderer";
// import { StaffFormFields } from "./StaffFormFields";
import {
    useCreateUser, useGetRole,
    useGetStaffByType,
    useUpdateUser,
} from "@/components/ApiCall/Api";
import { Button } from "@/components/ui/button";
import Table, { Column } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
// import { useActiveRoles } from "./ActiveRolesContext";
// import { useBranches } from "@/hooks/useBranches";

// import { FieldConfig } from "@/components/form/types";

const UserTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, refetch } = useGetStaffByType("patient");

  // const updateUserData = useUpdateStaff(selectedUser?.id ?? undefined);

  const { data:role } = useGetRole();
  // const { branches } = useBranches();
  const [mode, setMode] = useState<"add" | "edit">("add");

  const createUser = useCreateUser();
  const updateUser = useUpdateUser(selectedUser?.id);


const form = useForm<User>({
  defaultValues: {
    fullName: "",
    email: "",
    role_id: 2, // patient
    isActive: true,
  },
});

  useEffect(() => {
  if (mode === "edit" && selectedUser) {
    form.reset({
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      role_id: selectedUser.role_id,
      isActive: selectedUser.isActive,
    });
  }
}, [mode, selectedUser, form]);
  const handleAddUser = () => {
    setMode("add");
    setSelectedUser(null);
    form.reset();
    setIsOpen(true);
  };
  const handleEditUser = (user: User) => {
    setMode("edit");
    setSelectedUser(user);
    setIsOpen(true);
  };

  // When selectedUser changes, populate the form
 const onSubmit = (data: User) => {
  if (mode === "add") {
    createUser.mutate(data, {
      onSuccess: () => {
        form.reset();
        setIsOpen(false);
        refetch();
      },
    });
  }

  if (mode === "edit" && selectedUser?.id) {
    updateUser.mutate(data, {
      onSuccess: () => {
        form.reset();
        setIsOpen(false);
        setSelectedUser(null);
        refetch();
      },
    });
  }
};


  // const handleEditUser = (user: User) => {
  //   setSelectedUser(user);
  //   setIsOpen(true);
  // };



  // const dynamicFields: FieldConfig[] = StaffFormFields.filter(
  //   (f) => f.name !== "password"
  // ).map((f) => {
  //   const field: FieldConfig = { ...f, name: String(f.name) };

  //   if (field.name === "roleList") {
  //     return { ...field, options: activeRoles };
  //   }

  //   if (field.name === "branch") {
  //     return { ...field, options: branches };
  //   }

  //   const yesNoFields = ["allStaff", "allBranch", "sendSms", "sendEmail"];
  //   if (yesNoFields.includes(field.name)) {
  //     return {
  //       ...field,
  //       options: [
  //         { label: "Yes", value: "true" },
  //         { label: "No", value: "false" },
  //       ],
  //     };
  //   }

  //   return field;
  // });

  const columns: Column<User>[] = useMemo(
    () => [
      { header: "Full Name", accessor: "fullName" },
      { header: "Email", accessor: "email" },
      { header: "Role", accessor: "role_name" },
      {
        header: "Status",
        accessor: (row) => (row.isActive ? "Active" : "Inactive"),
      },
     
    ],
    []
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-foreground">
            Patient Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Appointment & Queue Management System
          </p>
        </div>
        <Button onClick={handleAddUser}>Add Patient</Button>
      </div>
      <Table data={data?.data || []} columns={columns}
      onEdit={(row)=>{
        handleEditUser(row)
      }}/>

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
            <DialogTitle>  {mode === "add" ? "Add Patient" : "Update Patient"}</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Full Name */}
  <FormField
    control={form.control}
    name="fullName"
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


  {/* Role (hidden or disabled since patient) */}
           <FormField
               control={form.control}
               name="role_id"
               render={({ field }) => (
                   <FormItem>
                       <FormLabel>Role</FormLabel>
                       <FormControl>
                           <select
                               className="w-full border rounded-md px-3 py-2"
                               value={field.value}
                               onChange={(e) => field.onChange(Number(e.target.value))}
                               disabled={mode === "edit"} // optional: lock role on edit
                           >
                               <option value="">Select role</option>

                               {role?.data?.map((r: any) => (
                                   <option key={r.id} value={r.id}>
                                       {r.code}
                                   </option>
                               ))}
                           </select>
                       </FormControl>
                       <FormMessage />
                   </FormItem>
               )}
           />


           {/* Active Status */}
  <FormField
    control={form.control}
    name="isActive"
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>Status</FormLabel>
        <FormControl>
          <select
            className="border rounded-md px-3 py-2"
            value={String(field.value)}
            onChange={(e) => field.onChange(e.target.value === "true")}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </FormControl>
      </FormItem>
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
