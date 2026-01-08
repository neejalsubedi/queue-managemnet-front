import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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

import {
    useGetDoctor,
    useAddDoctor,
    useUpdateDoctor,
    useDeleteDoctor,
} from "@/components/ApiCall/Api";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

import { Doctor } from "@/core/private/UserManagement/DoctorManagement/doctorTypes";

type Props = {
    departmentId: number;
};

const DoctorComponent = ({ departmentId }: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");

    /* Carousel state */
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { data, refetch } = useGetDoctor(departmentId);
    const doctors: Doctor[] = data?.data || [];

    const activeDoctor = doctors[activeIndex];

    const addDoctor = useAddDoctor();
    const updateDoctor = useUpdateDoctor(selectedDoctor?.id, departmentId);
    const deleteDoctor = useDeleteDoctor(selectedDoctor?.id);

    const form = useForm<Doctor>({
        defaultValues: {
            department_id: departmentId,
            name: "",
            phone: "",
            email: "",
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

    /* Reset when department or selected doctor changes */
    useEffect(() => {
        form.reset({
            department_id: departmentId,
            name: selectedDoctor?.name || "",
            phone: selectedDoctor?.phone || "",
            email: selectedDoctor?.email || "",
        });
        setActiveIndex(0);
    }, [departmentId, selectedDoctor, form]);

    /* ================= HANDLERS ================= */

    const handleAddDoctor = () => {
        setMode("add");
        setSelectedDoctor(null);
        setOpen(true);
    };

    const handleEditDoctor = (doctor: Doctor) => {
        setMode("edit");
        setSelectedDoctor(doctor);
        setOpen(true);
    };

    const onSubmit = (values: Doctor) => {
        const payload = {
            department_id: [departmentId], // ✅ array
            name: values.name,
            phone: values.phone,
            email: values.email,
        };

        const action = mode === "add"
            ? addDoctor.mutate
            : updateDoctor.mutate;

        action(payload, {
            onSuccess: () => {
                setOpen(false);
                setSelectedDoctor(null);
                refetch();
            },
        });
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Doctors</h2>
                <Button onClick={handleAddDoctor}>Add Doctor</Button>
            </div>

            {doctors.length > 0 ? (
                <Carousel
                    className="max-w-lg mx-auto"
                    setApi={setCarouselApi}
                >
                    <CarouselContent>
                        {doctors.map((doctor) => (
                            <CarouselItem key={doctor.id}>
                                <div className="border rounded-lg p-4 space-y-3">
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            📧 {doctor.email}
                                        </p>
                                        <p className="text-sm">
                                            📞 {doctor.phone}
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditDoctor(doctor)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                deleteDoctor.mutate(doctor.id, {
                                                    onSuccess: refetch,
                                                })
                                            }
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
            ) : (
                <p className="text-muted-foreground text-center">
                    No doctors found
                </p>
            )}

            {/* ================= DIALOG ================= */}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="min-w-[50vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Doctor" : "Update Doctor"}
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
                                    rules={{ required: "Doctor name is required" }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Doctor Name</FormLabel>
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
                            </div>

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

export default DoctorComponent;
