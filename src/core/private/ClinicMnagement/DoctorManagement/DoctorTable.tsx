import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
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
    useAddDoctor,
    useDeleteDoctor,
    useGetDoctor,
    useUpdateDoctor,
} from "@/components/ApiCall/Api.ts";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel.tsx";

import DoctorShiftDialog from "@/core/private/ClinicMnagement/DoctorManagement/DoctorShiftDialog.tsx";
import { Doctor } from "@/core/private/ClinicMnagement/DoctorManagement/doctorTypes.tsx";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { cn } from "@/lib/utils";
import { Mail, MoreVertical, Phone, Stethoscope, UserRound } from "lucide-react";

type Props = {
    departmentId: number;
};

const DoctorTable = ({ departmentId }: Props) => {
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [openShift, setOpenShift] = useState(false);

    /* Carousel state */
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [activeDoctorId, setActiveDoctorId] = useState<number | null>(null);


    const { data, refetch } = useGetDoctor(departmentId);
    const doctors: Doctor[] = data?.data || [];
    const [activeIndex, setActiveIndex] = useState(0);

    const addDoctor = useAddDoctor();
    const updateDoctor = useUpdateDoctor(selectedDoctor?.id);
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
    // useEffect(() => {
    //     if (!carouselApi) return;
    //
    //     const onSelect = () => {
    //         setActiveIndex(carouselApi.selectedScrollSnap());
    //     };
    //
    //     onSelect();
    //     carouselApi.on("select", onSelect);
    //
    //     return () => {
    //         carouselApi.off("select", onSelect);
    //     }
    // }, [carouselApi]);

    /* Reset when department or selected doctor changes */
    useEffect(() => {
        form.reset({
            department_id: departmentId,
            name: selectedDoctor?.name || "",
            phone: selectedDoctor?.phone || "",
            email: selectedDoctor?.email || "",
        });
        // setActiveIndex(0);
    }, [departmentId, selectedDoctor, form]);
    useEffect(() => {
        if (!doctors.length) return;

        const firstDoctor = doctors[0];

        setActiveDoctorId(firstDoctor.id);
        setActiveIndex(0);

        // scroll after carousel is ready
        requestAnimationFrame(() => {
            carouselApi?.scrollTo(0);
        });
    }, [departmentId, doctors, carouselApi]);


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
            department_id: [departmentId],
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
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Stethoscope className="h-4 w-4" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">Doctors</h2>
                </div>
                <Button onClick={handleAddDoctor} variant="outline" size="sm" className="gap-2">
                    + Add Doctor
                </Button>
            </div>

            {doctors.length > 0 ? (
                <div className="glass p-6 rounded-2xl">
                    <Carousel
                        setApi={setCarouselApi}
                        className="w-full max-w-4xl mx-auto px-4"
                    >
                        <CarouselContent className="-ml-4">
                            {doctors.map((doctor, index) => (
                                <CarouselItem
                                    key={doctor.id}
                                    className="pl-4 basis-1/2 md:basis-1/3"
                                >
                                    <div
                                        onClick={() => {
                                            setActiveDoctorId(doctor.id);
                                            carouselApi?.scrollTo(index);
                                            setActiveIndex(index)

                                        }}
                                        className={cn(
                                            "group relative flex flex-col justify-between h-full min-h-[160px] rounded-xl border p-5 transition-all duration-300 cursor-pointer",
                                            // index === activeIndex,
                                            activeDoctorId === doctor.id
                                                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/30 border-transparent scale-105"
                                                : "bg-card hover:bg-accent/50 text-card-foreground border-border/40 hover:shadow-md hover:-translate-y-1"
                                        )}
                                    >

                                    <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold shadow-inner",

                                                        activeDoctorId === doctor.id
                                                            ? "bg-white/20 text-white"
                                                            : "bg-muted text-muted-foreground"
                                                    )}
                                                >

                                                <UserRound className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                     <h3 className="text-base font-bold leading-none line-clamp-1">
                                                        {doctor.name}
                                                    </h3>
                                                    
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className={cn(
                                                        "h-8 w-8 -mr-3 -mt-2 opacity-70 hover:opacity-100",
                                                        activeDoctorId === doctor.id? "text-white hover:bg-white/20" : "text-muted-foreground"
                                                    )}>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={handleAddDoctor}>
                                                        Add Doctor
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditDoctor(doctor)}
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedDoctor(doctor);
                                                            setOpenShift(true);

                                                        }}
                                                    >
                                                        Allocate Shift
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() =>
                                                            deleteDoctor.mutate(doctor.id, {
                                                                onSuccess: () => refetch(),
                                                            })
                                                        }
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className={cn("flex items-center gap-2 text-xs", activeDoctorId === doctor.id? "text-emerald-50" : "text-muted-foreground")}>
                                                <Mail className="h-3 w-3 opacity-70" />
                                                <span className="truncate">{doctor.email}</span>
                                            </div>
                                            <div className={cn("flex items-center gap-2 text-xs", activeDoctorId === doctor.id ? "text-emerald-50" : "text-muted-foreground")}>
                                                <Phone className="h-3 w-3 opacity-70" />
                                                <span className="truncate">{doctor.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious className="-left-10 h-8 w-8 border-none bg-card/50 hover:bg-card shadow-sm" />
                        <CarouselNext className="-right-10 h-8 w-8 border-none bg-card/50 hover:bg-card shadow-sm" />

                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            {activeIndex+1} / {doctors.length}
                        </div>
                    </Carousel>
                </div>
            ) : (
                <div className="border border-dashed border-border rounded-xl p-8 text-center bg-muted/30">
                    <Stethoscope className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No doctors assigned to this department yet.</p>
                    <Button variant="link" onClick={handleAddDoctor}>Add one now</Button>
                </div>
            )}

            {/* ================= DIALOG ================= */}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="min-w-[50vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Doctor" : "Update Doctor"}
                        </DialogTitle>
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
                                                <Input {...field} placeholder="Dr. John Doe"/>
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
                                                <Input type="email" {...field} placeholder="doctor@example.com" />
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
                                                <Input {...field} placeholder="+977-..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add" ? "Save Doctor" : "Update Doctor"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {selectedDoctor && (
                <DoctorShiftDialog
                    open={openShift}
                    onClose={() => setOpenShift(false)}
                    doctor={selectedDoctor}
                />
            )}
        </div>
    );
};

export default DoctorTable;
