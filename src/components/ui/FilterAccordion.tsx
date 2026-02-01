import {useEffect, useState} from "react";
import type { DateRange } from "react-day-picker";
import { useForm, FormProvider } from "react-hook-form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../components/ui/accordion";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { DateRangePicker } from "@/helper/dateRangePicker";
import { formatDateYYYYMMDD } from "@/utility/date";

import { Filter } from "lucide-react";
import {useMediaQuery} from "@/helper/useMediaQuery.tsx";
type FilterAccordionProps = {
    title?: string;
    initialRange?: DateRange;
    dateRequired?: boolean;
    children?: React.ReactNode;
    onApply: (filters: {
        range?: { from: string; to: string };
        values: Record<string, any>;
    }) => void;
    onReset?: () => void;
};
const today = new Date();

const todayRange: DateRange = {
    from: today,
    to: today,
};

export function FilterAccordion({
                                    title = "Filters",
                                    initialRange=todayRange,
                                    dateRequired = true,
                                    children,
                                    onApply,
                                    onReset,
                                }: FilterAccordionProps) {
    const form = useForm({ defaultValues: {} });
    const [range, setRange] = useState<DateRange | undefined>(initialRange);

    // 📱 Mobile detection
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const handleApply = () => {
        if (dateRequired && (!range?.from || !range?.to)) return;

        onApply({
            ...(range?.from &&
                range?.to && {
                    range: {
                        from: formatDateYYYYMMDD(range.from),
                        to: formatDateYYYYMMDD(range.to),
                    },
                }),
            values: form.getValues(),
        });
    };

    const handleReset = () => {
        form.reset();
        setRange(initialRange);
        onReset?.();
    };
    const watchedValues = form.watch();

    useEffect(() => {
        const filledCount = Object.values(watchedValues).filter(
            (v) => v !== undefined && v !== ""
        ).length;

        if (filledCount >= 2) {
            handleApply();
        }
    }, [watchedValues]);


    return (
        <Accordion
            type="single"
            collapsible
            defaultValue={isDesktop ? "filters" : undefined}
            className="
        mb-4
        rounded-2xl
        border
        bg-background-secondary
        shadow-sm
      "
        >
            <AccordionItem value="filters" className="border-none">
                <AccordionTrigger
                    className="
            flex items-center gap-2
            px-4 py-3
            hover:no-underline
            data-[state=open]:border-b
          "
                >
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <Label className="text-base font-semibold">{title}</Label>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pt-4">
                    <FormProvider {...form}>
                        <form
                            className="
                grid grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
              "
                        >
                            {/* Date */}
                            {dateRequired && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Date</Label>
                                    <DateRangePicker value={range} onChange={setRange} />
                                </div>
                            )}

                            {/* Custom Filters */}
                            {children}

                            {/* Actions */}
                            <div className="col-span-full flex justify-end gap-3 pt-4">
                                <Button  type={ "button"} onClick={handleApply}>
                                    Apply Filter
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
