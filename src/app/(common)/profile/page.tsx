import HeadingAndBreadCrumb from "@/components/HeadingAndBreadCrumb"

function ProfilePage() {
  return (
    <div className="mb-16 md:mb-0 lg:mb-0 xl:mb-0">
      <div className="p-4 lg:px-8 overflow-x-hidden">
      <HeadingAndBreadCrumb
          heading="Profile"
          data={[
            {
              link: '/dashboard',
              name: 'Dashboard'
            },
            {
              link: '/profile',
              name: 'Profile'
            },
          ]}
        />
      </div>
    </div>
  )
}

export default ProfilePage