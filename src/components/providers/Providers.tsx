"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { initSupabase } from "@shared";
import { useAuth } from "@shared";
import { ThemeProvider } from "next-themes";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztlntpkaajgwkwsvdnal.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_QeiiJ1sckoCBaeVkQMUk-A_D1uoU1yR';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    useEffect(() => {
        initSupabase(SUPABASE_URL, SUPABASE_KEY);
        useAuth.getState().initialize();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
}
