"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Bell, Search, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminHeader({ user }: { user?: { name: string, role: string } | null }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/50 bg-background/50 px-6 backdrop-blur-md">
            <div className="flex flex-1 items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                
            </div>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                
                <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                    <div className="flex flex-col items-end gap-0.5 text-right">
                        <span className="text-sm font-semibold">{user?.name}</span>
                        <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{user?.role}</span>
                    </div>
                    <div className="h-10 w-10 overflow-hidden rounded-xl bg-brand/10 ring-2 ring-brand/20">
                        <User className="size-full p-2 text-brand" />
                    </div>
                </div>
            </div>
        </header>
    );
}
