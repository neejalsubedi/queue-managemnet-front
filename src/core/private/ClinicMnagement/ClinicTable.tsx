import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
    useAddClinic,
    useDeleteClinic,
    useGetClinic,
    useUpdateClinic,
} from "@/components/ApiCall/Api.ts";

import { Clinic } from "@/core/private/ClinicMnagement/clinicType.ts";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel.tsx";
import Department from "@/core/private/UserManagement/DepartmentManagement/Department.tsx";
import Doctor from "@/core/private/UserManagement/DoctorManagement/DoctorTable.tsx";



const ClinicTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(null);

    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { data, refetch } = useGetClinic();
    const clinics: Clinic[] = data?.data || [];

    const activeClinicId = clinics[activeIndex]?.id;

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

    /* Track active carousel slide */
    useEffect(() => {
        if (!carouselApi) return;

        const onSelect = () => {
            setActiveIndex(carouselApi.selectedScrollSnap());
        };

        onSelect();
        carouselApi.on("select", onSelect);

        return () => {
            carouselApi.off("select", onSelect);
        };
    }, [carouselApi]);

    /* Populate form on edit */
    useEffect(() => {
        if (mode === "edit" && selectedClinic) {
            form.reset(selectedClinic);
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
        setSelectedClinic(clinic)
        deleteClinic.mutate(clinic.id, { onSuccess:()=> refetch });
    };

    const onSubmit = (data: Clinic) => {
        const action =
            mode === "add"
                ? addClinic.mutate
                : updateClinic.mutate;

        action(data, {
            onSuccess: () => {
                setIsOpen(false);
                setSelectedClinic(null);
                form.reset();
                refetch();
            },
        });
    };

    return (
        <div className="p-6 space-y-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Clinic Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Appointment & Queue Management
                    </p>
                </div>
                <Button onClick={handleAddClinic}>Add Clinic</Button>
            </div>

            {/* Clinic Carousel */}
            {clinics.length > 0 && (
                <Carousel className="max-w-xl mx-auto" setApi={setCarouselApi}>
                    <CarouselContent>
                        {clinics.map((clinic) => (
                            <CarouselItem key={clinic.id}>
                                <div className="border rounded-xl p-6 space-y-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">{clinic.name}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {clinic.address}
                                        </p>
                                        <p className="text-sm mt-1">📞 {clinic.contact}</p>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditClinic(clinic)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteClinic(clinic)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}

            {/* 🔥 Department Component */}
            {activeClinicId && (
                <Department clinicId={activeClinicId}  onSelectDepartment={setActiveDepartmentId} />
            )}
            {activeDepartmentId && (
                <Doctor departmentId={activeDepartmentId} />
            )}


            {/* Clinic Dialog (unchanged) */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="min-w-[50vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Clinic" : "Update Clinic"}
                        </DialogTitle>
                        <DialogClose />
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Clinic Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add" ? "Save" : "Update"}
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
