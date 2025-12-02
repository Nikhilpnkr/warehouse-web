"use client";

import { useAuth } from "@shared";
import { Bell, Search, User } from "lucide-react";

import { ThemeToggle } from "../ThemeToggle";

export function Header() {
    const { user, profile } = useAuth();

    return (
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center flex-1">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block w-full pl-10 pr-3 py-1.5 border border-input rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
                <ThemeToggle />
                <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors">
                    <Bell className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground">
                            {profile?.full_name || user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {profile?.designation || "User"}
                        </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <User className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </header>
    );
}
