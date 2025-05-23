'use client';

import {
    LogOut,
    Settings,
    User
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { remove } from "@/store/slices/auth.slice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { removeProfile } from "@/store/slices/profile.slice";
import clsx from "clsx";
import AppLoading from "./AppLoading";
import { AvatarImage } from "./ui/avatar";
import Link from "next/link";

export function ProfileDropdown() {
    const profile = useAppSelector((state) => state.profile);
    const token = useAppSelector(state => state.auth.token);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { refetch, isFetching } = useQuery({
        queryKey: ['logout', token],
        queryFn: logout,
        enabled: false // prevent the query from running when the component is mounted. 
    });

    const handleLogout = async () => {
        // Invalidate queries instead of just refetching
        queryClient.invalidateQueries({ queryKey: ['logout'] });

        // Wait for refetch to complete
        const result = await refetch();

        if(result.isSuccess) {
            router.replace('/sign-in');
            dispatch(remove());
            dispatch(removeProfile());
        }

        if(result.isError) {
            alert(result.error.message);
        }
    }

    if(isFetching) return (
        <AppLoading />
    )
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={profile.dp} alt={profile.username} className="rounded-full w-9 h-9" />
                    <AvatarFallback 
                        delayMs={500}
                        className={clsx("bg-gray-400 text-white rounded-full p-3 text-sm")}
                    >
                        {profile.username.length > 0 && profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User />
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
