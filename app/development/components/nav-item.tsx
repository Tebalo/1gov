"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({
    href,
    label,
    children
}:{
    href: string;
    label: string;
    children: React.ReactNode
}){
    const pathmame = usePathname();
    const isActive = pathmame === href;
    return (
        <Link
            href={href}
            className={
                clsx(
                    'flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all duration-200 w-16',
                    'hover:bg-accent/50',
                    {
                        'bg-accent text-foreground': isActive,
                        'text-muted-foreground': !isActive
                    }
                )}
            >
            <div className="flex items-center justify-center h-6 w-6">
                {children}
            </div>
            <span className={clsx(
                'text-[10px] text-center font-medium transition-colors duration-200',
                {
                    'text-foreground': isActive,
                    'group-hover:text-foreground': !isActive
                }
            )}>
                {label}
            </span>
        </Link>
    );
}