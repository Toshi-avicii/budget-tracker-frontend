'use client';

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb"
import WelcomeMsg from "./WelcomeMsg"
import { Fragment } from "react";

interface HeadingAndBreadCrumbProps {
  heading: string;
  data: {
    link: string;
    name: string;
  }[]
}

function HeadingAndBreadCrumb({
  heading,
  data
}: HeadingAndBreadCrumbProps) {
  const pathname = usePathname();

  return (
    <div className="flex justify-between flex-col lg:flex-row">
      {
        pathname === '/dashboard' ? (
          <WelcomeMsg />
        ) : (
          <h1 className="text-lg lg:text-xl font-semibold">{heading}</h1>
        )
      }
      <div className="flex justify-start lg:justify-end items-center my-2">
        <Breadcrumb>
          <BreadcrumbList>
            {
              data.map((item, index, array) => {
                return (
                  <Fragment key={index}>
                    <BreadcrumbItem className="text-grey-400">
                      <BreadcrumbLink href={item.link}>{item.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    {
                      index < (array.length - 1) && <BreadcrumbSeparator />
                    }
                  </Fragment>
                )
              })
            }
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

export default HeadingAndBreadCrumb