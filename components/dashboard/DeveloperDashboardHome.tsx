"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layout, 
  ArrowRight,
  Zap,
  Star,
  Activity,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isPast } from "date-fns";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Task } from "@/lib/types/dashboard";
import { Button } from "@/components/ui/button";

export function DeveloperDashboardHome({ user }: { user: { id: string, name: string } }) {
  const { tasks, tasksMeta, isLoadingTasks: isLoading, fetchTasks } = useDashboardStore();

  useEffect(() => {
    fetchTasks({ assigned_to: user.id, limit: 100 }); // Fetch more for home stats
  }, [user.id]);

  const stats = {
    total: tasksMeta?.total || tasks.length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "done").length,
    overdue: tasks.filter(t => t.status !== "done" && t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date))).length,
  };

  const tasksToday = tasks.filter(t => t.status !== "done" && t.due_date && isToday(new Date(t.due_date)));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
          Hello, {user.name.split(" ")[0]}
          <Zap className="size-8 text-amber-500 fill-amber-500 animate-pulse" />
        </h2>
        <p className="text-muted-foreground text-lg font-medium opacity-80">Here is your roadmap for today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" value={stats.total} icon={Layout} color="blue" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="amber" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="emerald" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} color="rose" isCritical={stats.overdue > 0} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Tasks Today */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="size-5 text-amber-500 fill-amber-500" />
                    My Tasks Today
                </h3>
                <Badge variant="outline" className="h-7 px-3 bg-card border-border/50 text-xs font-bold text-muted-foreground whitespace-nowrap">
                    {tasksToday.length} DUE TODAY
                </Badge>
            </div>

            <div className="space-y-4">
                {tasksToday.map(task => (
                    <Card key={task.id} className="border-border/40 bg-card/40 backdrop-blur-xl rounded-[24px] p-5 group hover:ring-2 hover:ring-brand/30 transition-all duration-300">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                                    <Clock className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-lg leading-none">{task.title}</h4>
                                    <p className="text-sm text-muted-foreground font-medium">{task.project?.name || "Personal"}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-brand/10 hover:text-brand transition-all">
                                <ArrowRight className="size-5" />
                            </Button>
                        </div>
                    </Card>
                ))}
                {tasksToday.length === 0 && !isLoading && (
                    <div className="p-12 text-center rounded-3xl border-2 border-dashed border-border/40 bg-card/10 text-muted-foreground/50 font-medium">
                        No tasks due today. You're completely ahead!
                    </div>
                )}
            </div>
        </div>

        {/* Activity Section */}
        <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="size-5 text-brand" />
                Recent Activity
            </h3>
            <Card className="border-border/40 bg-card/40 backdrop-blur-xl rounded-[28px] overflow-hidden">
                <div className="p-6 space-y-6">
                    {tasks.slice(0, 5).map((task, i) => (
                        <div key={task.id} className="flex gap-4 relative">
                            {i !== 4 && <div className="absolute left-[18px] top-10 bottom-[-24px] w-[2px] bg-border/20" />}
                            <div className="h-9 w-9 shrink-0 rounded-full bg-accent/20 flex items-center justify-center z-10">
                                <UserIcon className="size-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-relaxed">
                                    You were assigned <span className="font-bold text-foreground">"{task.title}"</span> in {task.project?.name || "Global"}
                                </p>
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    {task.created_at ? format(new Date(task.created_at), "MMM dd, HH:mm") : "Just now"}
                                </span>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground/30 italic text-sm">
                            Waiting for activity logs...
                        </div>
                    )}
                </div>
                <div className="p-4 bg-muted/20 border-t border-border/20 text-center">
                    <Button variant="link" className="text-xs font-bold text-muted-foreground hover:text-brand transition-colors">VIEW FULL LOG</Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, isCritical }: { title: string, value: number, icon: any, color: string, isCritical?: boolean }) {
    const colors = {
        blue: "bg-blue-500/10 text-blue-500",
        amber: "bg-amber-500/10 text-amber-500",
        emerald: "bg-emerald-500/10 text-emerald-500",
        rose: "bg-rose-500/10 text-rose-500",
    };
    const colorClass = colors[color as keyof typeof colors] || colors.blue;
    
    return (
        <Card className={cn(
            "border-border/40 bg-card/40 backdrop-blur-xl rounded-[28px] p-6 transition-all hover:scale-[1.02] hover:shadow-xl",
            isCritical && "ring-2 ring-rose-500/20 bg-rose-500/5"
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", colorClass)}>
                    <Icon className="size-6" />
                </div>
                {isCritical && <Badge className="bg-rose-500 text-white border-none text-[10px] px-2 py-0 h-5 font-black uppercase">Urgent</Badge>}
            </div>
            <div className="space-y-1">
                <span className="text-sm font-bold text-muted-foreground leading-none">{title}</span>
                <p className="text-4xl font-black tracking-tight">{value}</p>
            </div>
        </Card>
    );
}
