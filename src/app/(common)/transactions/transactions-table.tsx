'use client';

import { useQuery } from "@tanstack/react-query";
import { getAllTransactionsByUser } from "./helpers";
import { useAppSelector } from "@/store/reduxHooks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import PeriodTableCell from "../budget/PeriodTableCell";
import { transactionsTableColumns } from "./columns";

function TransactionsTable() {
  const token = useAppSelector(state => state.auth.token);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  // 🚀 Always fresh pagination state from table
  const { pageIndex, pageSize } = pagination;

  const transactionListQuery = useQuery({
    queryKey: ['get-transactions-by-user', pagination],
    queryFn: async () => {
      return await getAllTransactionsByUser({ limit: pagination.pageSize, page: pagination.pageIndex + 1, token })
    },
  });

  const table = useReactTable({
    data: transactionListQuery.data?.data.data || [],
    columns: transactionsTableColumns,
    getCoreRowModel: getCoreRowModel(), // this hook is used for making rows
    getPaginationRowModel: getPaginationRowModel(), // this hook is used for pagination
    onColumnFiltersChange: setColumnFilters, // this is used for column filters
    getFilteredRowModel: getFilteredRowModel(), // used for filtered rows
    getSortedRowModel: getSortedRowModel(), // used for table sorting
    manualPagination: true,
    pageCount: transactionListQuery.data?.data.totalPages,
    state: {
      columnFilters
    },
    onPaginationChange: () => {},
  });

  return (
    <div>
      {
        transactionListQuery.isLoading && (
          <div>
            Loading...
          </div>
        )
      }
      {
        transactionListQuery.isSuccess && (
          <div>
            <div className="rounded-md border my-4">
              {/* data table */}
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
                      <TableCell colSpan={transactionsTableColumns.length} className="h-24 text-center">
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
                onClick={() =>
                  setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))
                }                
                disabled={pageIndex === 0}
              >
                <RiArrowLeftSLine />
              </Button>
              {Array.from({ length: transactionListQuery.data?.data.totalPages || 1 }).map((_, index) => (
                <Button
                  key={index}
                  variant={pagination.pageIndex === index ? "default" : "outline"}
                  size="sm"
                  // onClick={() => table.setPageIndex(index)}
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: index }))}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
                }
                disabled={pageIndex + 1 >= (transactionListQuery.data?.data.totalPages || 1)}
              >
                <RiArrowRightSLine />
              </Button>
            </div>
          </div>
        )
      }
      {
        transactionListQuery.isError && (
          <p>{transactionListQuery.error.message}</p>
        )
      }
    </div>
  )
}

export default TransactionsTable