import HeadingAndBreadCrumb from "@/components/HeadingAndBreadCrumb"
import TransactionsTable from "./transactions-table"
import ChatBox from "@/components/Socket"

function TransactionsPage() {
    return (
        <div className="mb-16 md:mb-0 lg:mb-0 xl:mb-0">
            <div className="p-4 lg:px-8 overflow-x-hidden">
                <HeadingAndBreadCrumb
                    heading="Transactions"
                    data={[
                        {
                            link: '/dashboard',
                            name: 'Dashboard'
                        },
                        {
                            link: '/transactions',
                            name: 'Transactions'
                        }
                    ]}
                />
                <div>
                    <TransactionsTable />
                    <ChatBox />
                </div>
            </div>
        </div>
    )
}

export default TransactionsPage