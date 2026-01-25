import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import Department from "@/core/private/ClinicMnagement/DepartmentManagement/Department.tsx";
import Doctor from "@/core/private/ClinicMnagement/DoctorManagement/DoctorTable.tsx";
import { cn } from "@/lib/utils";
import { Building2, MapPin, MoreVertical, Phone } from "lucide-react";



const ClinicTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(null);

    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { data, refetch } = useGetClinic();
    const clinics: Clinic[] = data?.data || [];

    const [activeClinicId, setActiveClinicId] = useState<number | string | null>(null);


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
    //     };
    // }, [carouselApi]);

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
    const handleClinicClick = (clinic: Clinic, index: number) => {
        setActiveIndex(index);
        setActiveClinicId(clinic.id ?? null);
        setActiveDepartmentId(null); // reset downstream
    };
    useEffect(() => {
        if (clinics.length > 0 && !activeClinicId) {
            setActiveClinicId(clinics[0].id ?? null);
            setActiveIndex(0);
        }
    }, [clinics]);

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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Clinic Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage clinics, departments, and doctors efficiently.
                    </p>
                </div>
                <Button onClick={handleAddClinic} size="lg" className="shadow-md">
                    + Add New Clinic
                </Button>
            </div>

            {/* Clinic Carousel */}
            {clinics.length > 0 ? (
                <div className="glass p-8 rounded-3xl relative">
                    <div className="absolute top-2 bottom-2 left-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Select Clinic
                    </div>
                     <Carousel className="w-full max-w-5xl mx-auto px-4" setApi={setCarouselApi}>
                        <CarouselContent className="-ml-4">
                            {clinics.map((clinic, index) => (
                                <CarouselItem key={clinic.id} className="pl-4 basis-1/2 lg:basis-1/3">
                                    <div
                                        onClick={() => handleClinicClick(clinic, index)}
                                        className={cn(
                                            "group relative flex flex-col justify-between h-48 rounded-2xl cursor-pointer transition-all duration-300 p-5 overflow-hidden",
                                            activeClinicId === clinic.id
                                                ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary/20"
                                                : "bg-card hover:bg-accent/50 text-card-foreground border border-border/40 hover:shadow-md hover:-translate-y-1"
                                        )}
                                    >
                                        <div className="space-y-3 z-10">
                                            <div className="flex justify-between items-start">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                                    activeClinicId === clinic.id ? "bg-white/20" : "bg-primary/10 text-primary"
                                                )}>
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={cn(
                                                                "h-8 w-8 -mr-2",
                                                                activeClinicId === clinic.id ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground"
                                                            )}
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditClinic(clinic)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClinic(clinic);
                                                            }}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-bold leading-tight line-clamp-1">
                                                    {clinic.name}
                                                </h2>
                                                <p className={cn("text-xs mt-1 line-clamp-1 flex items-center gap-1", activeClinicId === clinic.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                                    <MapPin className="h-3 w-3" />
                                                    {clinic.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "flex items-center gap-2 text-sm font-medium pt-3 border-t",
                                            activeClinicId === clinic.id ? "border-white/20 text-white" : "border-border/50 text-foreground"
                                        )}>
                                            <Phone className="h-3.5 w-3.5 opacity-70" />
                                            {clinic.contact}
                                        </div>
                                        
                                        {/* Decorative background circle */}
                                        <div className={cn(
                                            "absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl transition-all duration-500",
                                             activeClinicId === clinic.id ? "bg-white/20" : "bg-primary/5 group-hover:bg-primary/10"
                                        )} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-12 h-10 w-10 border-none bg-card/50 hover:bg-card shadow-sm" />
                        <CarouselNext className="-right-12 h-10 w-10 border-none bg-card/50 hover:bg-card shadow-sm" />
                         <div className="mt-4 text-center text-sm text-muted-foreground">
                             {activeIndex + 1} / {clinics.length}
                         </div>
                    </Carousel>
                </div>
            ) : (
                <div className="glass p-12 text-center rounded-3xl">
                     <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                     </div>
                     <h3 className="text-lg font-medium">No Clinics Found</h3>
                     <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">Start by adding a new clinic to the system.</p>
                     <Button onClick={handleAddClinic}>Add Clinic</Button>
                </div>
            )}

            {/* Department & Doctor Section */}
            <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-backwards" style={{ animationDelay: '200ms'}}>
                <div className="relative">
                    {activeClinicId ? (
                        <Department
                            clinicId={activeClinicId}
                            onSelectDepartment={setActiveDepartmentId}
                        />
                    ) : (
                         null
                    )}
                </div>

                <div className="relative">
                     {activeDepartmentId !== null && (
                         <Doctor departmentId={activeDepartmentId} />
                     )}
                </div>
            </div>


            {/* Clinic Dialog (unchanged) */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "Add Clinic" : "Update Clinic"}
                        </DialogTitle>
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
                                            <Input {...field} placeholder="e.g. City Central Clinic" />
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
                                            <Input {...field} placeholder="+977-98..." />
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
                                            <Input {...field} placeholder="Street, City" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">
                                    {mode === "add" ? "Save Clinic" : "Update Clinic"}
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
