import Link from 'next/link';
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface FixedNavLinkProps {
    href: string;
    icon: React.ReactNode;
    tooltipText: string;
    children?: React.ReactNode;
}

function FixedNavLink({ href, icon, tooltipText }: FixedNavLinkProps) {
    return (
        <Link href={href}>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                    {icon}
                </TooltipTrigger>
                <TooltipContent side='right' className="bg-white text-black shadow-md">
                    <span>{tooltipText}</span>
                </TooltipContent>
            </Tooltip>
        </Link>
    )
}

export default FixedNavLink