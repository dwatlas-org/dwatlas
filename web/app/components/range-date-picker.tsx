"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function RangeDatePicker({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (next?: DateRange) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start gap-2 px-2.5 font-normal"
          />
        }
      >
        <CalendarIcon className="h-4 w-4 text-slate-500" />
        {value?.from ? (
          value.to ? (
            `${format(value.from, "dd/MM/yyyy")} — ${format(value.to, "dd/MM/yyyy")}`
          ) : (
            format(value.from, "dd/MM/yyyy")
          )
        ) : (
          <span className="text-slate-400">Select dates</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
