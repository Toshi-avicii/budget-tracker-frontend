'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { TbLayoutDashboardFilled, TbUserSquareRounded, TbRepeat } from "react-icons/tb";
import { PiPiggyBankFill } from "react-icons/pi";
import { SiActualbudget } from "react-icons/si";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";

export function AppSidebar() {
    const items = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: TbLayoutDashboardFilled,
            style: {
                fontSize: '20px'
            }
        },
        {
            title: "Profile",
            url: "/profile",
            icon: TbUserSquareRounded,
        },
        {
            title: "Budget",
            icon: PiPiggyBankFill,
            isActive: true,
            items: [
                {
                    title: 'List',
                    url: '/budget',
                },
                {
                    title: 'Create new',
                    url: '/budget/new',
                }
            ]
        },
        {
            title: "Transactions",
            icon: TbRepeat,
            isActive: true,
            items: [
                {
                    title: 'List',
                    url: '/transactions',
                },
                {
                    title: 'New',
                    url: '/transactions/new',
                }
            ]
        },
    ]

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="p-4">
                <SiActualbudget className="text-3xl cursor-pointer" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item, index) => {
                            if (item.items && item.items.length > 0) {
                                return (
                                    <Collapsible
                                        key={index}
                                        asChild
                                        defaultOpen={item.isActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton asChild tooltip={item.title}>
                                                    <div>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </div>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {
                                                        (item.items && item.items.length > 0) && (
                                                            <div>
                                                                {
                                                                    item.items.map((entry, index) => {
                                                                        return (
                                                                            <SidebarMenuSubItem key={index}>
                                                                                <SidebarMenuSubButton asChild>
                                                                                    <Link href={entry.url} className="flex items-center">
                                                                                        <span>{entry.title}</span>
                                                                                    </Link>
                                                                                </SidebarMenuSubButton>
                                                                            </SidebarMenuSubItem>
                                                                        )
                                                                    })
                                                                }
                                                            </div>

                                                        )
                                                    }
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            } else {
                                return (
                                    <SidebarMenuItem className="flex items-center gap-2" key={index}>
                                        <SidebarMenuButton asChild tooltip={item.title}>
                                            {
                                                !item.url ? <div>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </div> : <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            }


                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
