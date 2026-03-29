"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle, MessageSquare } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { Task } from "@/lib/types/dashboard";
import { StatusBadge } from "./StatusBadge";

interface KanbanProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function DeveloperKanban({ tasks, onTaskClick }: KanbanProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-700 slide-in-from-bottom-4">
      <KanbanColumn 
        title="Pending" 
        tasks={tasks.filter(t => t.status === "todo")} 
        color="slate"
        onTaskClick={onTaskClick}
      />
      <KanbanColumn 
        title="In Progress" 
        tasks={tasks.filter(t => t.status === "in_progress")} 
        color="amber"
        onTaskClick={onTaskClick}
      />
      <KanbanColumn 
        title="Completed" 
        tasks={tasks.filter(t => t.status === "done")} 
        color="emerald"
        onTaskClick={onTaskClick}
      />
    </div>
  );
}

function KanbanColumn({ title, tasks, color, onTaskClick }: { title: string, tasks: Task[], color: string, onTaskClick: (t: Task) => void }) {
    const colors = {
        slate: "bg-slate-500/10 text-slate-500",
        amber: "bg-amber-500/10 text-amber-500",
        emerald: "bg-emerald-500/10 text-emerald-500",
    };
    
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className={cn("h-2.5 w-2.5 rounded-full ring-4 ring-background", color === 'slate' ? 'bg-slate-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500')} />
                    <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-none font-black text-[10px] px-2 h-5">{tasks.length}</Badge>
                </div>
            </div>
            
            <div className="flex-1 space-y-4 min-h-[500px] p-2 rounded-[32px] bg-muted/5 border border-dashed border-border/20">
                {tasks.map(task => (
                    <Card 
                        key={task.id} 
                        className={cn(
                            "border-border/40 bg-card/40 backdrop-blur-xl rounded-[24px] p-5 group hover:ring-2 hover:ring-brand/30 hover:border-brand/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl",
                            task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== "done" && "ring-rose-500/20 bg-rose-500/5 border-rose-500/20"
                        )}
                        onClick={() => onTaskClick(task)}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-brand bg-brand/5 border-brand/20 h-6">
                                    {task.project?.name || "Global"}
                                </Badge>
                                {task.due_date && (
                                     <div className={cn(
                                         "flex items-center gap-1.5 px-2 py-1 rounded-lg bg-card/50",
                                         isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== "done" ? "text-rose-500 font-black" : "text-muted-foreground font-bold"
                                     )}>
                                        {isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== "done" ? <AlertCircle className="size-3" /> : <Clock className="size-3" />}
                                        <span className="text-[10px] uppercase tracking-wider">{format(new Date(task.due_date), "MMM dd")}</span>
                                    </div>
                                )}
                            </div>
                            <h4 className={cn("text-lg font-bold leading-tight group-hover:text-brand transition-colors", task.status === "done" && "text-muted-foreground line-through opacity-60")}>{task.title}</h4>
                            <div className="flex items-center justify-between pt-2 border-t border-border/10 mt-2">
                                <StatusBadge status={task.status} />
                                <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center text-muted-foreground">
                                    <MessageSquare className="size-3.5" />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {tasks.length === 0 && (
                    <div className="h-full flex items-center justify-center p-10 text-center text-muted-foreground/30 font-bold italic text-sm">
                        No tasks in this stage
                    </div>
                )}
            </div>
        </div>
    );
}
