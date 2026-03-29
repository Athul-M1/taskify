"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { Task } from "@/lib/types/dashboard";
import { StatusBadge } from "./StatusBadge";

interface TableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function DeveloperTable({ tasks, onTaskClick }: TableProps) {
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[32px] overflow-hidden animate-in fade-in duration-700 slide-in-from-bottom-4">
        <Table>
            <TableHeader className="bg-muted/30">
                <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="py-4 px-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Task Details</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Project</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Due Date</TableHead>
                    <TableHead className="text-right px-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map(task => (
                    <TableRow key={task.id} className="border-border/20 hover:bg-muted/10 cursor-pointer group" onClick={() => onTaskClick(task)}>
                        <TableCell className="py-4 px-6">
                            <div className="space-y-0.5">
                                <p className="font-bold text-base group-hover:text-brand transition-colors">{task.title}</p>
                                <p className="text-xs text-muted-foreground/70 font-medium truncate max-w-[200px]">{task.description}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="h-6 bg-brand/5 border-brand/20 text-brand font-bold text-[10px] uppercase">{task.project?.name || "Global"}</Badge>
                        </TableCell>
                        <TableCell>
                            <StatusBadge status={task.status} />
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                                <Calendar className={cn("size-3.5", task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== "done" ? "text-rose-500" : "text-muted-foreground")} />
                                <span className={cn(task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== "done" && "text-rose-500")}>
                                    {task.due_date ? format(new Date(task.due_date), "MMM dd") : "No limit"}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right px-6">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border/30 opacity-0 group-hover:opacity-100 transition-all">
                                <ChevronRight className="size-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                {tasks.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="py-20 text-center text-muted-foreground/50 font-bold italic">
                            No matching tasks found in your queue
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  );
}
