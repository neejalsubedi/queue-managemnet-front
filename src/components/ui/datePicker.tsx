import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toLocalDateString } from "@/helper/toLocaleDateString";
import { useState } from "react";

interface DatePickerProps {
  date: string | undefined;
  onDateChange: (date: string | undefined) => void;
  label: string | undefined;
}

export function DatePicker({ date, onDateChange, label }: DatePickerProps) {
  const parsedDate = date ? parseISO(date) : undefined;
  const [open, setOpen] = useState(false); // <-- manually control popover

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[150px] justify-start text-left font-medium",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(parsedDate!, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 space-y-2" align="start">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={(selected: Date | undefined) => {
            if (selected) {
              onDateChange(toLocalDateString(selected));
              setOpen(false);
            }
          }}
        />
        {date && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-red-600"
            onClick={() => {
              onDateChange(undefined);
              setOpen(false);
            }}
          >
            Clear Date
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
