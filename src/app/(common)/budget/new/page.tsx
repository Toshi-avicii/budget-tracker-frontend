import BudgetForm from "@/components/BudgetForm";
import HeadingAndBreadCrumb from "@/components/HeadingAndBreadCrumb"
import { Card, CardContent } from "@/components/ui/card";

function NewBudgetPage() {
  return (
    <div className="mb-16 md:mb-0 lg:mb-0 xl:mb-0">
        <div className="p-4 lg:px-8 overflow-x-hidden">
        <HeadingAndBreadCrumb
          heading="Add a new budget"
          data={[
            {
              link: '/dashboard',
              name: 'Dashboard'
            },
            {
              link: '/budget',
              name: 'Budget'
            },
            {
              link: '/budget/new',
              name: 'Add New'
            }
          ]}
        />
        <div className="my-4 min-h-[calc(80vh-20px)] lg:flex lg:justify-center">
            <Card className="lg:px-2 pt-4 m-auto rounded-md lg:min-w-[512px] lg:max-w-lg">
                <CardContent>
                    <BudgetForm />
                </CardContent>
            </Card>
        </div>
        </div>
    </div>
  )
}

export default NewBudgetPage