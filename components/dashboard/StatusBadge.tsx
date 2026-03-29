"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Activity, Check } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
    const configs = {
        todo: { bg: "bg-slate-500/10", text: "text-slate-500", label: "Todo", icon: Clock },
        in_progress: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Working", icon: Activity },
        done: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Done", icon: Check },
    };
    const config = configs[status as keyof typeof configs] || configs.todo;
    const Icon = config.icon;
    
    return (
        <Badge className={cn("border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest h-6 gap-1.5 ml-[-2px]", config.bg, config.text)}>
            <Icon className="size-3.5" />
            {config.label}
        </Badge>
    );
}
