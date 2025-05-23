import HeadingAndBreadCrumb from "@/components/HeadingAndBreadCrumb"
import NewTransactionForm from "./NewTransactionForm"

function NewTransactionPage() {
  return (
    <div className="mb-16 md:mb-0 lg:mb-0 xl:mb-0">
            <div className="p-4 lg:px-8 overflow-x-hidden">
                <HeadingAndBreadCrumb
                    heading="Add a new transaction"
                    data={[
                        {
                            link: '/dashboard',
                            name: 'Dashboard'
                        },
                        {
                            link: '/transactions',
                            name: 'Transactions'
                        },
                        {
                            link: '/transactions/new',
                            name: 'New'
                        }
                    ]}
                />
                <div>
                    <NewTransactionForm />
                </div>
            </div>
        </div>
  )
}

export default NewTransactionPage