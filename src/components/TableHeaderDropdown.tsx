import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Column } from '@tanstack/react-table';
import { ListFilter } from 'lucide-react';

interface TableHeaderDropdownProps<TData> {
    currentValue: string;
    options: string[];
    column: Column<TData>;
}

function TableHeaderDropdown<TData>({
    currentValue,
    options,
    column
}: TableHeaderDropdownProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="p-0 capitalize w-full justify-start border-none">
                    {currentValue || "Expense Type"}
                    <ListFilter />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option}
                        onClick={() => column.setFilterValue(option)}
                        className='capitalize'
                    >
                        {option}
                    </DropdownMenuItem>
                ))}
                {currentValue && (
                    <DropdownMenuItem
                        onClick={() => column.setFilterValue(undefined)}
                        className="text-red-500"
                    >
                        Clear Filter
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TableHeaderDropdown