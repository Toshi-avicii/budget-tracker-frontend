'use client'

import { useTheme } from "next-themes"
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { SiActualbudget } from "react-icons/si";
import { ProfileDropdown } from "./ProfileDropdown";
import { SidebarTrigger } from "./ui/sidebar";
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from "react";

function Navbar() {
    const { setTheme, theme } = useTheme();
    const { scrollY } = useScroll();
    const [pageScrollY, setPageScrollY] = useState(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setPageScrollY(latest);
    })

    return (
        <motion.div 
            initial={{
                backgroundColor: 'transparent'
            }}
            animate={{
                backgroundColor: pageScrollY < 50 ? 'transparent' : (theme === 'dark') ? '#121128' : '#fff'
            }}
            className="p-4 lg:px-8 flex sticky top-0 w-full left-0 bg-teal-400 z-50"
        >
            {/* search bar */}
            <div className="flex-[3] lg:flex-[4]">
                <div className="block md:hidden">
                    <SiActualbudget className="text-3xl cursor-pointer" />
                </div>
            </div>

            {/* misc. */}
            <div className="flex gap-2 flex-[2] lg:flex-1 items-center justify-end">
                <SidebarTrigger />
                <Button
                    className="bg-transparent shadow-none hover:bg-transparent"
                    onClick={() => {
                        if (theme === 'light' || theme === 'system') {
                            setTheme('dark');
                        } else {
                            setTheme('light');
                        }
                    }}
                >
                    <Sun
                        className={clsx("transition-all text-white", theme === 'light' ? 'hidden' : 'inline-block')}
                    />
                    <Moon
                        className={clsx("transition-all text-black", (theme === 'light' || theme === 'system') ? 'inline-block' : 'hidden')}
                    />
                </Button>
                <ProfileDropdown />
            </div>
        </motion.div>
    )
}

export default Navbar