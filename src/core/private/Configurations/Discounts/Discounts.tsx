// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useEffect, useState } from "react";
// import {
//   DiscountFormData,
//   DiscountListResponseData,
//   GetDiscountDataResponse,
// } from "../ConfigTypes";
// import { Plus } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useApiMutation } from "@/components/ApiCall/ApiMutation";
// import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
// import { useApiGet } from "@/components/ApiCall/ApiGet";
// import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
// import { LoadingData } from "@/helper/loadingData";
// import { TableSkeleton } from "@/helper/tableSkeleton";

// const Discounts = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [selectedDiscount, setSelectedDiscount] =
//     useState<DiscountListResponseData | null>(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

//   const {
//     data: fetchedDiscountData,
//     isPending: pendingDiscountData,
//     refetch,
//     isRefetching: refetchingDiscountData,
//   } = useApiGet<GetDiscountDataResponse>(
//     QUERY_KEYS.GET_CONFIGURATION_DISCOUNT,
//     {
//       retry: 0,
//     }
//   );

//   const { mutate: addDiscountApi, isPending: pendingAddDiscount } =
//     useApiMutation("post", API_ENDPOINTS.DISCOUNT.ADD_DISCOUNT);

//   const { mutate: updateDiscountApi, isPending: pendingUpdateDiscount } =
//     useApiMutation(
//       "put",
//       API_ENDPOINTS.DISCOUNT.UPDATE_DISCOUNT(selectedDiscount?.id)
//     );

//   const { mutate: deleteDiscountApi, isPending: pendingDeleteDiscount } =
//     useApiMutation("delete", API_ENDPOINTS.DISCOUNT.DELETE_DISCOUNT);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting },
//   } = useForm<DiscountFormData>({
//     // resolver: zodResolver(null),
//     defaultValues: {
//       name: "",
//       description: "",
//       percentage: null,
//     },
//   });

//   useEffect(() => {
//     if (!isDialogOpen) {
//       reset();
//       setSelectedDiscount(null);
//     }
//   }, [isDialogOpen, reset]);

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//     reset();
//     setSelectedDiscount(null);
//   };

//   const handleAddDiscount = (data: DiscountFormData) => {
//     const requestBody = {
//       name: data.name,
//       description: data.description,
//       percentage: Number(data.percentage),
//     };
//     if (!selectedDiscount) {
//       // console.log(requestBody);
//       addDiscountApi(requestBody, {
//         onSuccess: () => {
//           setIsDialogOpen(false);
//           refetch();
//           reset();
//         },
//       });
//     } else {
//       updateDiscountApi(data, {
//         onSuccess: () => {
//           setIsDialogOpen(false);
//           refetch();
//           reset();
//           setSelectedDiscount(null);
//         },
//       });
//       // console.log(data);
//     }
//   };

//   const handleDeleteDiscount = (data: DiscountListResponseData) => {
//     deleteDiscountApi(
//       { id: data.id },
//       {
//         onSuccess: () => {
//           setOpenDeleteDialog(false);
//           refetch();
//           setSelectedDiscount(null);
//         },
//       }
//     );
//     // console.log("delete", data);
//   };

//   // const fetchedDiscountData = [
//   //   {
//   //     id: 1,
//   //     name: "Senior Citizen",
//   //     percentage: 10,
//   //     description: "10% off for customers 60+",
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Senior Citizen",
//   //     percentage: 10,
//   //     description: "10% off for customers 60+",
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Senior Citizen",
//   //     percentage: 10,
//   //     description: "10% off for customers 60+",
//   //   },
//   // ];

//   const allPendingStates = [
//     pendingAddDiscount,
//     pendingDeleteDiscount,
//     pendingUpdateDiscount,
//   ];

//   if (allPendingStates.some(Boolean)) return <LoadingData />;
//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between w-full">
//             <CardTitle>Discounts Table</CardTitle>
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
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Discount
//                 </Button>
//               </DialogTrigger>

//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>
//                     {selectedDiscount ? "Edit Discount" : "Add Discount"}
//                   </DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit(handleAddDiscount)}>
//                   <div className="grid grid-cols-2 gap-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name">Discount Name *</Label>
//                       <Input
//                         id="name"
//                         placeholder="Enter discount name"
//                         {...register("name")}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="percentage">Percentage *</Label>
//                       <Input
//                         type="number"
//                         id="percentage"
//                         placeholder="Enter discount %"
//                         {...register("percentage")}
//                       />
//                     </div>
//                     <div className="space-y-2 col-span-4">
//                       <Label htmlFor="description">Description *</Label>
//                       <Textarea
//                         id="description"
//                         placeholder="Write description"
//                         {...register("description")}
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
//                         ? selectedDiscount
//                           ? "Updating Discount..."
//                           : "Adding Discount..."
//                         : selectedDiscount
//                         ? "Update Discount"
//                         : "Add Discount"}
//                     </Button>
//                   </div>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {pendingDiscountData || refetchingDiscountData ? (
//             <TableSkeleton rows={4} columns={7} />
//           ) : fetchedDiscountData?.data?.length ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>S.No</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Percentage</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {fetchedDiscountData?.data?.map((dis, index) => (
//                   <TableRow key={dis.id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{dis.name}</TableCell>
//                     <TableCell>{dis.percentage}%</TableCell>
//                     <TableCell>{dis.description}</TableCell>
//                     <TableCell className="text-right space-x-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDiscount(dis);
//                           setIsDialogOpen(true);
//                           // console.log(branch);
//                           reset({
//                             name: dis.name,
//                             description: dis.description,
//                             percentage: dis.percentage,
//                           });
//                         }}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={() => {
//                           setSelectedDiscount(dis);
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
//               Are you sure you want to remove this discount?
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
//                 if (selectedDiscount) {
//                   handleDeleteDiscount(selectedDiscount);
//                 }
//               }}
//             >
//               {/* {pendingDeleteDiscount ? " Removing...." : "Yes, Remove"} */}
//               yes, Remove
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };
// export default Discounts;
