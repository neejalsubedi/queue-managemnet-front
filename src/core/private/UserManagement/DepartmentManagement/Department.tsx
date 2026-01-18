import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    useAddDepartment,
    useDeleteDepartment,
    useGetDepartment,
    useUpdateDepartment,
} from "@/components/ApiCall/Api";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

/* ================= TYPES ================= */

type Department = {
    id?: number;
    clinic_id: number;
    name: string;
};

type DepartmentProps = {
    clinicId: number|string;
    onSelectDepartment: (id: number) => void;
};

/* ================= COMPONENT ================= */

const Department = ({ clinicId, onSelectDepartment }: DepartmentProps) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Department | null>(null);

    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { data, refetch } = useGetDepartment(clinicId);
    const departments: Department[] = data?.data || [];

    const activeDepartment = departments[activeIndex];

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

        return () => carouselApi.off("select", onSelect);
    }, [carouselApi]);

    useEffect(() => {
        if (activeDepartment?.id) {
            onSelectDepartment(activeDepartment.id);
        }
    }, [activeDepartment, onSelectDepartment]);

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
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Departments</h2>
                <Button onClick={() => setOpen(true)}>Add Department</Button>
            </div>

            {departments.length > 0 ? (
                <Carousel
                    setApi={setCarouselApi}
                    className="max-w-xl mx-auto"
                >
                    <CarouselContent>
                        {departments.map((dept, index) => (
                            <CarouselItem key={dept.id}>
                                <div
                                    className={`rounded-xl p-6 space-y-4 border transition-all
                                    ${
                                        index === activeIndex
                                            ? "border-primary shadow-md"
                                            : "border-muted"
                                    }`}
                                >
                                    <h3 className="text-lg font-semibold text-center">
                                        {dept.name}
                                    </h3>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelected(dept);
                                                setOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                deleteDepartment.mutate(dept.id, {
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

                    {/* ⬅️➡️ Navigation like Clinic */}
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
                <p className="text-muted-foreground text-center">
                    No departments found
                </p>
            )}

            {/* ================= DIALOG ================= */}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
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
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">
                                    {selected ? "Update" : "Save"}
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
