import HeadingAndBreadCrumb from "@/components/HeadingAndBreadCrumb"
import BudgetTable from "./budget-table"

function BudgetListPage() {
  return (
    <div className="mb-16 md:mb-0 lg:mb-0 xl:mb-0">
         <div className="p-4 lg:px-8 overflow-x-hidden">
         <HeadingAndBreadCrumb
          heading="Budgets"
          data={[
            {
              link: '/dashboard',
              name: 'Dashboard'
            },
            {
              link: '/budget',
              name: 'Budget'
            },
          ]}
        />
          <BudgetTable />
         </div>
    </div>
  )
}

export default BudgetListPage