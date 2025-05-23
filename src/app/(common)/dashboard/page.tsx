import DashboardCardRow from "@/components/DashboardCardRow"
import DashboardChartWrapper from "@/components/DashboardChartWrapper"
import HeadingAndBreadCrumb from "@/components/HeadingAndBreadCrumb"

function DashboardPage() {
  

  return (
    <div className="mb-16 md:mb-0 lg:mb-0 xl:mb-0">
      <div className="p-4 lg:px-8 overflow-x-hidden">
        <HeadingAndBreadCrumb
          heading="Dashboard"
          data={[
            {
              link: '/dashboard',
              name: 'Dashboard'
            }
          ]}
        />

        <DashboardCardRow />

        <DashboardChartWrapper />
      </div>
    </div>
  )
}

export default DashboardPage