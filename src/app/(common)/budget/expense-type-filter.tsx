'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Column, Table } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";

interface ExpenseTypeFilterProps<TData> {
  tableHook: Table<TData>;
  column: Column<TData, string[]>;
  options: string[];
  buttonText: string;
  emptyMessage: string;
  inputPlaceholder: string;
}

function TypeFilter<TData>({ column, options, buttonText, emptyMessage, inputPlaceholder }: ExpenseTypeFilterProps<TData>) {
  const selectedValues: string[] = Array.isArray(column.getFilterValue())
  ? (column.getFilterValue() as string[])
  : [];

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    column.setFilterValue(newValues.length ? newValues : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-auto w-full md:w-fit px-4 text-xs" size="icon">
          <CirclePlus />
          {buttonText}
          <div className="flex gap-x-2">
            {
              selectedValues.length === options.length ? <Badge variant="secondary" className="capitalize">All Selected</Badge> :
                selectedValues.length > 2 ? <Badge variant="secondary" className="capitalize">{selectedValues.length} Selected</Badge> :
                  selectedValues.map(item => (<Badge key={item} variant="secondary" className="capitalize">
                    {item}
                  </Badge>))
            }
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder={inputPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = selectedValues.includes(option)
              return (
                <CommandItem
                  key={option}
                  onSelect={() => toggleValue(option)}
                >
                  <div className="flex items-center gap-x-2 w-full text-xs md:text-sm">
                    <Checkbox checked={isSelected} className="h-4 w-4 text-primary" />
                    <span>{option}</span>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
          <CommandSeparator />
          {
            (selectedValues.length > 0) && 
            <CommandGroup>
              <CommandItem>
                <Button 
                  onClick={() => column.setFilterValue(undefined)}
                  className="p-0 h-auto bg-transparent text-xs w-full font-normal border-none"
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CommandItem>
            </CommandGroup>
          }
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TypeFilter