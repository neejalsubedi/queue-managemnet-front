// import { useApiGet } from "@/components/ApiCall/ApiGet";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { BranchData, GetBranchDataResponse } from "../ConfigTypes";
// import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Plus } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { useEffect, useState } from "react";
// import { useApiMutation } from "@/components/ApiCall/ApiMutation";
// import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
// import { LoadingData } from "@/helper/loadingData";
// import { TableSkeleton } from "@/helper/tableSkeleton";

// const Branches = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

//   const {
//     data: fetchedAllBranch,
//     isPending: pendingBranchData,
//     isRefetching: refetchingBranchData,
//     refetch,
//   } = useApiGet<GetBranchDataResponse>(QUERY_KEYS.GET_ALL_BRANCH, {
//     retry: 0,
//   });

//   const { mutate: addBranchApi, isPending: pendingAddBranch } = useApiMutation(
//     "post",
//     // API_ENDPOINTS.BRANCH.ADD_BRANCH
//     "api/clinics"
//   );
//   const { mutate: updateBranchApi, isPending: pendingUpdateBranch } =
//     useApiMutation(
//       "put",
//       API_ENDPOINTS.BRANCH.UPDATE_BRANCH(selectedBranch?.id)
//     );
//   const { mutate: deleteBranchApi, isPending: pendingDeleteBranch } =
//     useApiMutation("delete", API_ENDPOINTS.BRANCH.DELETE_BRANCH);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting },
//   } = useForm<BranchData>({
//     // resolver: zodResolver(null),
//     defaultValues: {
//       name: "",
//       address: "",
//       phoneNumber: null,
//       email: "",
//     },
//   });

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//     reset();
//     setSelectedBranch(null);
//   };

//   useEffect(() => {
//     if (!isDialogOpen) {
//       reset();
//       setSelectedBranch(null);
//     }
//   }, [isDialogOpen, reset]);

//   const handleAddBranch = (data: BranchData) => {
//     const requestBody = {
//       name: data.name,
//       address: data.address,
//       contact: data.phoneNumber,
//       // email: data.email,
//     };

//     if (selectedBranch) {
//       updateBranchApi(data, {
//         onSuccess: () => {
//           setIsDialogOpen(false);
//           refetch();
//           reset();
//         },
//       });
//     } else {
//       addBranchApi(requestBody, {
//         // onSuccess: () => {
//         //   refetch();
//         //   setIsDialogOpen(false);
//         //   reset();
//         //   setSelectedBranch(null);
//         // },
//       });
//     }
//   };

//   const handleDeleteBranch = (data: BranchData) => {
//     deleteBranchApi(
//       { id: data.id },
//       {
//         onSuccess: () => {
//           setOpenDeleteDialog(false);
//           refetch();
//           setSelectedBranch(null);
//         },
//       }
//     );
//   };

//   const allPendingStates = [
//     pendingAddBranch,
//     pendingUpdateBranch,
//     pendingDeleteBranch,
//   ];

//   if (allPendingStates.some(Boolean)) return <LoadingData />;

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between w-full">
//             <CardTitle>Branch Table</CardTitle>
//             <Dialog
//               open={isDialogOpen}
//               onOpenChange={(open) => {
//                 if (!open) handleCloseDialog();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button
//                   className="bg-gradient-primary shadow-md hover:shadow-lg transition-all"
//                   onClick={() => {
//                     setIsDialogOpen(true);
//                     reset({
//                       name: "",
//                       address: "",
//                     });
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Branch
//                 </Button>
//               </DialogTrigger>

//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>
//                     {selectedBranch ? "Edit Branch" : "Add Branch"}
//                   </DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit(handleAddBranch)}>
//                   <div className="grid grid-cols-2 gap-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name">Branch Name *</Label>
//                       <Input
//                         id="name"
//                         placeholder="Enter branch name"
//                         {...register("name")}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email *</Label>
//                       <Input
//                         id="email"
//                         placeholder="Enter email"
//                         {...register("email")}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="phoneNumber">Contact Number *</Label>
//                       <Input
//                         type="number"
//                         id="phoneNumber"
//                         placeholder="Enter phoneNumber"
//                         {...register("phoneNumber")}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="address">Address *</Label>
//                       <Input
//                         id="address"
//                         placeholder="Enter address"
//                         {...register("address")}
//                       />
//                     </div>
//                   </div>
//                   <div className="flex justify-end space-x-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={handleCloseDialog}
//                     >
//                       Cancel
//                     </Button>
//                     <Button type="submit" className="bg-gradient-primary">
//                       {isSubmitting
//                         ? selectedBranch
//                           ? "Updating Branch..."
//                           : "Adding Branch..."
//                         : selectedBranch
//                         ? "Update Branch"
//                         : "Add Branch"}
//                     </Button>
//                   </div>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {pendingBranchData || refetchingBranchData ? (
//             <TableSkeleton rows={4} columns={7} />
//           ) : fetchedAllBranch?.data?.length ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>S.No</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Contact</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Address</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {fetchedAllBranch?.data.map((branch, index) => (
//                   <TableRow key={branch.id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{branch.name}</TableCell>
//                     <TableCell>{branch.phoneNumber}</TableCell>
//                     <TableCell>{branch.email}</TableCell>
//                     <TableCell>{branch.address}</TableCell>
//                     <TableCell className="text-right space-x-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedBranch(branch);
//                           setIsDialogOpen(true);
//                           // console.log(branch);
//                           reset({
//                             name: branch.name,
//                             address: branch.address,
//                             phoneNumber: branch.phoneNumber,
//                             email: branch.email,
//                           });
//                         }}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={() => {
//                           setSelectedBranch(branch);
//                           setOpenDeleteDialog(true);
//                         }}
//                       >
//                         Delete
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <p className="text-muted-foreground text-center">No data found</p>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Remove</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to remove this branch?
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setOpenDeleteDialog(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 if (selectedBranch) {
//                   handleDeleteBranch(selectedBranch);
//                 }
//               }}
//             >
//               {pendingDeleteBranch ? " Removing...." : "Yes, Remove"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Branches;
