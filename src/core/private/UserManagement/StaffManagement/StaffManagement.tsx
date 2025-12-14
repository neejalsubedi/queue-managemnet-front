// import { useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import UserTable from "./UserTable";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { GenericFormRenderer } from "@/components/form/GenericFormRenderer";
// import { StaffFormFields } from "./StaffFormFields";
// import { useAddStaff } from "@/components/ApiCall/Api";
// import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
// import { FieldConfig } from "@/components/form/types";
// import { useActiveRoles } from "./ActiveRolesContext";
// import { useBranches } from "@/hooks/useBranches";

// const StaffManagement = () => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   const queryClient = useQueryClient();

//   const { mutate: addUserMutate, isPending: pendingAddEmployee } =
//     useAddStaff();
//   const { activeRoles } = useActiveRoles();
//   const { branches } = useBranches();

//   const form = useForm({
//     defaultValues: {},
//   });

//   const onSubmit = (data: any) => {
//     const payload = {
//       ...data,
//       branch: Number(data.branch),
//       allBranch: data.allBranch === "true" || data.allBranch === true,
//       allStaff: data.allStaff === "true" || data.allStaff === true,
//       sendSms: data.sendSms === "true" || data.sendSms === true,
//       sendEmail: data.sendEmail === "true" || data.sendEmail === true,
//       roleList: data.roleList.map((r: string | number) => Number(r)),
//     };

//     addUserMutate(payload, {
//       onSuccess: () => {
//         form.reset();
//         setIsOpen(false);
//         queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
//       },
//     });

//     // console.log(payload);
//   };

//   const dynamicFields: FieldConfig[] = StaffFormFields.map((f) => {
//     const field: FieldConfig = { ...f, name: String(f.name) };

//     if (field.name === "roleList") {
//       return { ...field, options: activeRoles };
//     }

//     if (field.name === "branch") {
//       return { ...field, options: branches };
//     }

//     const yesNoFields = ["allStaff", "allBranch", "sendSms", "sendEmail"];
//     if (yesNoFields.includes(field.name)) {
//       return {
//         ...field,
//         options: [
//           { label: "Yes", value: "true" },
//           { label: "No", value: "false" },
//         ],
//       };
//     }

//     return field;
//   });

//   return (
//     <>
//       <div className="flex justify-between">
//         <header>
//           <h1 className="text-3xl font-bold text-foreground">
//             Employee Management
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             Add, update, and organize employees while managing their roles,
//             access levels, and branch associations.
//           </p>
//         </header>
//         <Button onClick={() => setIsOpen(true)}>Add Employee</Button>
//       </div>
//       <div>
//         <UserTable />
//         <Dialog
//           open={isOpen}
//           onOpenChange={(open) => {
//             setIsOpen(open);
//             if (!open) {
//               form.reset();
//             }
//           }}
//         >
//           <DialogContent className="max-h-[90vh] min-w-[60vw] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Add Employee</DialogTitle>
//               <DialogClose />
//             </DialogHeader>

//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-6"
//               >
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <GenericFormRenderer form={form} fields={dynamicFields} />
//                 </div>

//                 <DialogFooter className="flex justify-center">
//                   <Button type="submit">
//                     {pendingAddEmployee ? "Adding..." : "Add"}
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );
// };

// export default StaffManagement;
