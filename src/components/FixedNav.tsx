import { TbLayoutDashboardFilled, TbUserSquareRounded } from "react-icons/tb";
import { SiActualbudget } from "react-icons/si";
import { PiPiggyBankFill } from "react-icons/pi";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import FixedNavLink from "./FixedNavLink";

function FixedNav() {
    return (
        <div className='p-4 bg-blue-600 text-white fixed md:static lg:fixed bottom-0 w-full z-[200] md:min-h-screen md:h-full md:max-w-24'>
            <div className="hidden md:flex justify-center items-center mb-6">
                <SiActualbudget className="text-3xl cursor-pointer" />
            </div>
            <div className="flex flex-row md:flex-col gap-3 justify-center items-center">
                <TooltipProvider>
                    <FixedNavLink 
                        href="/dashboard"
                        icon={<TbLayoutDashboardFilled className="text-2xl" />}
                        tooltipText="Dashboard"
                    />
                    <FixedNavLink 
                        href="/profile"
                        icon={<TbUserSquareRounded className="text-2xl" />}
                        tooltipText="Profile"
                    />

                    <FixedNavLink 
                        href="/budget"
                        icon={<PiPiggyBankFill className="text-2xl" />}
                        tooltipText="Budget"
                    />
                </TooltipProvider>
            </div>
        </div>
    )
}

export default FixedNav