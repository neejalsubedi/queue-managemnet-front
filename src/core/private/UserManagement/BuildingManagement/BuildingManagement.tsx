// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Row } from "@tanstack/react-table";
// import { Pencil, Trash2 } from "lucide-react";
//
// import Table from "@/components/Table/Table";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Form } from "@/components/ui/form";
// import { GenericFormRenderer } from "@/components/form/GenericFormRenderer";
// import TableCellFormatter from "@/helper/TableCellFormatter";
//
// import {
//   useAddBuilding,
//   useDeleteBuilding,
//   useGetAllBuilding,
//   useUpdateBuilding,
// } from "@/components/ApiCall/Api";
// import { BuildingRequest, BuildingResponse } from "./BranchManagementTypes";
// import { BuildingFormFields } from "./fields";
//
// const BuildingManagement = () => {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedBranch, setSelectedBranch] = useState<BuildingResponse | null>(
//     null
//   );
//
//   const { data: fetchedBranch, refetch } = useGetAllBuilding();
//   const { mutate: addBranch, isPending: pendingAdd } = useAddBuilding();
//   const { mutate: updateBranch, isPending: pendingUpdate } = useUpdateBuilding(
//     selectedBranch?.id
//   );
//   const { mutate: deleteBranch, isPending: pendingDelete } =
//     useDeleteBuilding();
//
//   const isEditMode = !!selectedBranch;
//
//   const form = useForm<BuildingRequest>({
//     defaultValues: {
//       name: "",
//       address: "",
//     },
//   });
//
//   useEffect(() => {
//     if (!isFormOpen) return;
//
//     if (selectedBranch) {
//       form.reset({
//         name: selectedBranch.name,
//         address: selectedBranch.address,
//       });
//     } else {
//       form.reset({
//         name: "",
//         address: "",
//       });
//     }
//   }, [selectedBranch, isFormOpen, form]);
//
//   const onSubmit = (data: BuildingRequest) => {
//     if (isEditMode && selectedBranch) {
//       updateBranch(data, {
//         onSuccess: () => {
//           closeForm();
//         },
//       });
//     } else {
//       addBranch(data, {
//         onSuccess: () => {
//           closeForm();
//         },
//       });
//     }
//   };
//
//   const closeForm = () => {
//     setIsFormOpen(false);
//     setSelectedBranch(null);
//     form.reset();
//     refetch();
//   };
//
//   const handleDelete = () => {
//     if (!selectedBranch) return;
//
//     deleteBranch(
//       { id: selectedBranch.id },
//       {
//         onSuccess: () => {
//           setOpenDeleteDialog(false);
//           setSelectedBranch(null);
//           refetch();
//         },
//       }
//     );
//   };
//
//   const columns = [
//     {
//       header: "S.No",
//       cell: ({ row }: { row: Row<BuildingResponse> }) => row.index + 1,
//     },
//     {
//       accessorKey: "name",
//       header: "Building Name",
//       cell: ({ row }: { row: Row<BuildingResponse> }) => (
//         <TableCellFormatter value={row.original.name} />
//       ),
//     },
//     {
//       accessorKey: "address",
//       header: "Building Address",
//       cell: ({ row }: { row: Row<BuildingResponse> }) => (
//         <TableCellFormatter value={row.original.address} />
//       ),
//     },
//     {
//       header: "Actions",
//       cell: ({ row }: { row: Row<BuildingResponse> }) => (
//         <div className="space-x-2">
//           <Button
//             size="sm"
//             onClick={() => {
//               setSelectedBranch(row.original);
//               setIsFormOpen(true);
//             }}
//           >
//             <Pencil size={16} />
//           </Button>
//
//           <Button
//             size="sm"
//             variant="destructive"
//             onClick={() => {
//               setSelectedBranch(row.original);
//               setOpenDeleteDialog(true);
//             }}
//           >
//             <Trash2 color="white" size={15} />
//           </Button>
//         </div>
//       ),
//     },
//   ];
//
//   return (
//     <>
//       <div className="flex justify-between">
//         <header>
//           <h1 className="text-3xl font-bold text-foreground">
//             Building Management
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             Create, update, and organize building information efficiently.
//           </p>
//         </header>
//
//         <Button
//           onClick={() => {
//             setSelectedBranch(null);
//             setIsFormOpen(true);
//           }}
//         >
//           Add Building
//         </Button>
//       </div>
//
//       <Table
//         columns={columns}
//         getData={async () => fetchedBranch?.data ?? []}
//         pageSize={10}
//         enablePagination={false}
//       />
//
//       <Dialog
//         open={isFormOpen}
//         onOpenChange={(open) => {
//           setIsFormOpen(open);
//
//           if (!open) {
//             form.reset();
//             setSelectedBranch(null);
//           }
//         }}
//       >
//         <DialogContent className="min-w-[60vw]">
//           <DialogHeader>
//             <DialogTitle>
//               {isEditMode ? "Update Building" : "Add Building"}
//             </DialogTitle>
//             <DialogClose />
//           </DialogHeader>
//
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-2 gap-3">
//                 <GenericFormRenderer form={form} fields={BuildingFormFields} />
//               </div>
//
//               <DialogFooter className="justify-center">
//                 <Button type="submit">
//                   {pendingAdd
//                     ? "Saving..."
//                     : pendingUpdate
//                     ? "Updating..."
//                     : isEditMode
//                     ? "Update"
//                     : "Add"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//
//       <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Remove</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to remove this building?
//             </DialogDescription>
//           </DialogHeader>
//
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setOpenDeleteDialog(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDelete}
//               className="text-white"
//             >
//               {pendingDelete ? "Removing..." : "Yes, Remove"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };
//
// export default BuildingManagement;
