"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  VisibilityState,
  SortingState,
  getSortedRowModel
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, X } from "lucide-react"
import TypeFilter from "./expense-type-filter"
import PeriodTableCell from "./PeriodTableCell"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { getBudgetCategories } from "./new/helpers"
import { useAppSelector } from "@/store/reduxHooks"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const token = useAppSelector(state => state.auth.token);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, // default page size
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const budgetCategoryQuery = useQuery({
    queryKey: ['get-budget-categories-list'],
    queryFn: async () => {
      return await getBudgetCategories(token);
    },
  });

  const expenseCategories = budgetCategoryQuery.data?.data.data.map((item: { _id: string, name: string }) => {
    return item.name;
  })

  let expenseTypeOptions = [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // this hook is used for making rows
    getPaginationRowModel: getPaginationRowModel(), // this hook is used for pagination
    onColumnFiltersChange: setColumnFilters, // this is used for column filters
    getFilteredRowModel: getFilteredRowModel(), // used for filtered rows
    getSortedRowModel: getSortedRowModel(), // used for table sorting
    onColumnVisibilityChange: setColumnVisibility, // used for showing column visibility
    onSortingChange: setSorting,
    state: {
      pagination,
      columnFilters,
      columnVisibility,
      sorting
    },
    onPaginationChange: setPagination,
    initialState: {
      pagination: {
        pageSize: pagination.pageSize,
      },
    },
  });

  if(expenseCategories) {
    expenseTypeOptions = expenseCategories;
  } else {
    expenseTypeOptions = ['groceries', 'other', 'entertainment', 'food', 'savings', 'clothes', 'education', 'healthcare', 'debt', 'electronics'];
  }

  const expensePeriodOptions = ['No limit', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];

  const filters = table.getState().columnFilters;

  return (
    <div>
      <div className="flex items-center py-4 flex-col lg:flex-row flex-wrap">
        <div className="flex flex-[2] items-center lg:justify-start flex-col lg:flex-row flex-wrap lg:flex-nowrap w-full gap-2">
          <div className="w-full flex-1 lg:w-auto lg:flex-none">
            <Input
              placeholder="Filter by name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="font-normal w-full"
            />
          </div>
          <div className="flex gap-2 flex-1 w-full lg:w-auto flex-wrap">
            {/* expense type */}
            <div className="flex-1 lg:flex-none">
              <TypeFilter
                tableHook={table}
                column={table.getColumn("expenseType")}
                options={expenseTypeOptions}
                buttonText="Type"
                emptyMessage="No Types Found."
                inputPlaceholder="Expense Type"
              />
            </div>
            {/* period types */}
            <div className="flex-1 lg:flex-none">
              <TypeFilter
                tableHook={table}
                column={table.getColumn("expensePeriodType")}
                options={expensePeriodOptions}
                buttonText="Period"
                emptyMessage="No Expense Period Found."
                inputPlaceholder="Expense Period"
              />
            </div>
            {
              (filters.length > 0) && (
                <div className="flex-1 lg:flex-none">
                  <Button
                    onClick={() => table.resetColumnFilters()}
                    variant="outline"
                    size="icon"
                    className="w-full lg:w-auto px-4 text-xs shadow-sm"
                  >
                    <X size={8} />
                    Reset
                  </Button>
                </div>
              )
            }
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center w-full my-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto w-full lg:w-fit px-4 text-xs" size="icon">
                <SlidersHorizontal className="text-xs" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs px-2 py-1 font-medium">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border my-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.columnDef.header === "Period") {
                        return (
                          <TableCell key={cell.id}>
                            <PeriodTableCell cell={cell} value={cell.getValue()} />
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <RiArrowLeftSLine />
        </Button>
        {Array.from({ length: table.getPageCount() }).map((_, index) => (
          <Button
            key={index}
            variant={table.getState().pagination.pageIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => table.setPageIndex(index)}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <RiArrowRightSLine />
        </Button>
      </div>
    </div>
  )
}
