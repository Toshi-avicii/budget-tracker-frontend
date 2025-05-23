import { Cell, flexRender } from "@tanstack/react-table";
import clsx from "clsx";

interface PeriodTableCellProps<TData> {
    value: unknown;
    cell: Cell<TData, unknown>
}

function PeriodTableCell<TData>({ value, cell }: PeriodTableCellProps<TData>) {
  return (
    <span className={clsx("px-4 py-1 rounded-full text-xs capitalize shadow-md font-medium", value === 'Yearly' ? "bg-teal-200 text-teal-600" : value === 'Monthly' ? "bg-rose-200 text-rose-600" : value === 'Daily' ? "bg-sky-200 text-sky-600" : value === 'Weekly' ? "bg-orange-200 text-orange-600" : 'bg-fuchsia-200 text-fuchsia-600')}>
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </span>
  )
}

export default PeriodTableCell