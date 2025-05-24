import { deleteBudget } from "@/app/(common)/budget/helpers";
import { Budget } from "@/app/(common)/budget/types";
import { useAppSelector } from "@/store/reduxHooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Edit3, MoreHorizontal, Trash } from "lucide-react";
import EditBudgetForm from "@/app/(common)/budget/edit-budget-form";

interface TableCellProps {
    row: Row<Budget>
}

function TableCell({ row }: TableCellProps) {
    const token = useAppSelector(state => state.auth.token);
    const budgetEntry = row.original;
    const queryClient = useQueryClient();
    const [dialogType, setDialogType] = useState<'edit' | 'delete' | null>(null);
    const deleteBudgetMutation = useMutation({
        mutationFn: deleteBudget,
        onMutate() {
            toast.loading('Sending...', { id: 'budget-delete-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('budget-delete-toast');
                toast.success(data.data.data.message);
                setDialogType(null);
                queryClient.invalidateQueries({ queryKey: ['get-budget-list'] });
            }
        },
        onError(error) {
            toast.dismiss('budget-delete-toast');
            toast.error(error.message);
        },
    })
    return (
        <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <DialogTrigger asChild>
                            <div className='flex gap-x-2 items-center text-sm cursor-pointer w-full' onClick={() => setDialogType('edit')}>
                                <Edit3 size={14} />
                                Edit
                            </div>
                        </DialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log(budgetEntry._id)}>
                        <DialogTrigger asChild onClick={() => setDialogType('delete')}>
                            <div className='flex gap-x-2 w-full items-center text-sm cursor-pointer'>
                                <Trash size={14} />
                                Delete
                            </div>
                        </DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {
                dialogType === 'edit' &&
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Budget</DialogTitle>
                    </DialogHeader>
                    {/* dialog body */}
                    <EditBudgetForm budgetData={budgetEntry} onSuccessfulFormSubmit={() => setDialogType(null)} />
                </DialogContent>
            }

            {
                dialogType === 'delete' &&
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Budget</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Are you sure you want to delete this budget? All the transactions related to this budget will also get deleted.</p>
                    </div>
                    {/* dialog footer */}
                    <DialogFooter>
                        <Button
                            onClick={() => deleteBudgetMutation.mutate({
                                token,
                                budgetId: budgetEntry._id
                            })}
                        >
                            <Trash />
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            }

        </Dialog>
    )
}

export default TableCell