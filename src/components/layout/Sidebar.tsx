"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Warehouse,
    Users,
    FileText,
    Settings,
    LogOut
} from "lucide-react";
import { useAuth } from "@shared";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Warehouses", href: "/warehouses", icon: Warehouse },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
            <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
                <span className="text-xl font-bold text-sidebar-primary">Stokify</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0",
                                        isActive
                                            ? "text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-sidebar-border p-4">
                <button
                    onClick={() => signOut()}
                    className="group flex w-full items-center px-3 py-2 text-sm font-medium text-sidebar-foreground rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 text-sidebar-foreground/70 group-hover:text-destructive" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
