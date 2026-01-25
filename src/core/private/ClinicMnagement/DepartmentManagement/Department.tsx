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
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
    useAddDepartment,
    useDeleteDepartment,
    useGetDepartment,
    useUpdateDepartment,
} from "@/components/ApiCall/Api.ts";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel.tsx";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { cn } from "@/lib/utils";
import { Layers, MoreVertical } from "lucide-react";

/* ================= TYPES ================= */

type Department = {
    id?: number;
    clinic_id: number | string;
    name: string;
};

type DepartmentProps = {
    clinicId: number | string;
    onSelectDepartment: (id: number | null) => void;
};


/* ================= COMPONENT ================= */

const Department = ({ clinicId, onSelectDepartment }: DepartmentProps) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Department | null>(null);

    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { data, refetch } = useGetDepartment(clinicId) as any;
    const departments: Department[] = data?.data || [];

    const addDepartment = useAddDepartment();
    const updateDepartment = useUpdateDepartment(selected?.id);
    const deleteDepartment = useDeleteDepartment(selected?.id);

    const form = useForm<Department>({
        defaultValues: {
            clinic_id: clinicId,
            name: "",
        },
    });

    /* ================= EFFECTS ================= */

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

    const handleDepartmentClick = (dept: Department, index: number) => {
        if (!dept.id) return;
        setActiveIndex(index);
        onSelectDepartment(dept.id);
    };

    useEffect(() => {
        if (departments.length > 0) {
            onSelectDepartment(departments[0].id || null);
            setActiveIndex(0);
        } else {
             onSelectDepartment(null);
        }
    }, [departments, clinicId]);

    useEffect(() => {
        form.reset({
            clinic_id: clinicId,
            name: selected?.name || "",
        });
    }, [clinicId, selected, form]);

    useEffect(() => {
        setActiveIndex(0);
    }, [clinicId]);

    /* ================= HANDLERS ================= */

    const onSubmit = (values: Department) => {
        const payload = {
            clinic_id: clinicId,
            name: values.name,
        };

        const action = selected
            ? updateDepartment.mutate
            : addDepartment.mutate;

        action(payload, {
            onSuccess: () => {
                setOpen(false);
                setSelected(null);
                refetch();
            },
        });
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Layers className="h-4 w-4" />
                   </div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Departments
                    </h2>
                </div>
                <Button onClick={() => { setSelected(null); setOpen(true); }} variant="outline" size="sm" className="gap-2">
                    + Add Department
                </Button>
            </div>

            {departments.length > 0 ? (
                <div className="glass p-6 rounded-2xl">
                    <Carousel
                        setApi={setCarouselApi}
                        className="w-full max-w-4xl mx-auto px-4"
                    >
                        <CarouselContent className="-ml-4">
                            {departments.map((dept, index) => (
                                <CarouselItem key={dept.id} className="pl-4 basis-1/2 md:basis-1/3">
                                    <div
                                        onClick={() => handleDepartmentClick(dept, index)}
                                        className={cn(
                                            "group relative h-full rounded-xl cursor-pointer transition-all duration-300 p-4 border flex flex-col justify-between min-h-[120px]",
                                            index === activeIndex
                                                ? "bg-gradient-to-br from-emerald-300 to-emerald-400 text-white shadow-lg ring-2 ring-blue-500/30 border-transparent scale-105"
                                                : "bg-card hover:bg-accent/50 text-card-foreground border-border/40 hover:shadow-md hover:-translate-y-1"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-base font-semibold tracking-tight line-clamp-2">
                                                {dept.name}
                                            </h3>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={cn(
                                                            "h-6 w-6 -mr-2 -mt-1 opacity-70 hover:opacity-100 transition-opacity",
                                                            index === activeIndex ? "text-white hover:bg-white/20" : "text-muted-foreground"
                                                        )}
                                                    >
                                                        <MoreVertical className="h-3.5 w-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelected(dept);
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteDepartment.mutate(dept.id, {
                                                                onSuccess: () => refetch(),
                                                            });
                                                        }}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        
                                         {/* <div className="mt-auto pt-2">
                                            <div className={cn(
                                                "text-xs font-medium px-2 py-0.5 rounded-full w-fit",
                                                index === activeIndex ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                            )}>
                                                Active
                                            </div>
                                         </div> */}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation */}
                        <CarouselPrevious className="-left-10 h-8 w-8 border-none bg-card/50 hover:bg-card shadow-sm" />
                        <CarouselNext className="-right-10 h-8 w-8 border-none bg-card/50 hover:bg-card shadow-sm" />
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            {activeIndex + 1} / {departments.length}
                        </div>
                    </Carousel>
                </div>
            ) : (
                <div className="border border-dashed border-border rounded-xl p-8 text-center bg-muted/30">
                    <Layers className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No departments in this clinic yet.</p>
                    <Button variant="link" onClick={() => setOpen(true)}>Create one now</Button>
                </div>
            )}

            {/* ================= DIALOG ================= */}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Update Department" : "Add Department"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. Cardiology" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">
                                    {selected ? "Update Department" : "Save Department"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Department;
