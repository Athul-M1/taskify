"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2,
  Calendar,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format, isPast, isToday } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { Task } from "@/lib/types/dashboard";
import { DeveloperKanban } from "./DeveloperKanban";
import { DeveloperTable } from "./DeveloperTable";
import { TaskDiscussion } from "./TaskDiscussion";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Pagination } from "./Pagination";

export function DeveloperTaskManager({ user }: { user: { id: string, name: string } }) {
  const { 
    tasks, 
    tasksMeta,
    isLoadingTasks: isLoading, 
    fetchTasks, 
    updateTaskStatus: updateStatus 
  } = useDashboardStore();

  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks({ 
      assigned_to: user.id,
      page: page
    });
  }, [page]);

  // Reset page when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
    else fetchTasks({ assigned_to: user.id, page: 1 });
  }, [statusFilter, dateFilter]);

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    let matchesDate = true;
    if (dateFilter === "today") matchesDate = task.due_date ? isToday(new Date(task.due_date)) : false;
    if (dateFilter === "overdue") matchesDate = task.due_date ? (isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== "done") : false;
    
    return matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">My Tasks</h2>
          <p className="text-muted-foreground mt-1 text-base">Execution-focused workspace for your assigned items.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
            <Button 
                variant={view === "kanban" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("kanban")}
                className={cn("rounded-xl font-bold h-9 px-4", view === "kanban" && "bg-background shadow-sm hover:bg-background")}
            >
                <LayoutGrid className="size-4 mr-2" />
                Kanban
            </Button>
            <Button 
                variant={view === "table" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("table")}
                className={cn("rounded-xl font-bold h-9 px-4", view === "table" && "bg-background shadow-sm hover:bg-background")}
            >
                <List className="size-4 mr-2" />
                Table
            </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 py-4 px-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[28px]">
        <div className="flex items-center gap-2 text-muted-foreground mr-4">
            <Filter className="size-4" />
            <span className="text-xs font-black uppercase tracking-widest leading-none mt-0.5">Quick Filters</span>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[140px] bg-muted/50 border-none rounded-xl font-bold text-xs ring-offset-0 focus:ring-0">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
            </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-9 w-[140px] bg-muted/50 border-none rounded-xl font-bold text-xs ring-offset-0 focus:ring-0">
                <SelectValue placeholder="Timeline" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border rounded-xl">
                <SelectItem value="all">Anytime</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" className="ml-auto text-xs font-bold text-muted-foreground hover:text-brand" onClick={() => { setStatusFilter("all"); setDateFilter("all"); }}>
            Clear Filters
        </Button>
      </div>

      {isLoading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-brand" /></div>
      ) : (
          <>
            {view === "kanban" ? (
                <DeveloperKanban tasks={filteredTasks} onTaskClick={setSelectedTask} />
            ) : (
                <DeveloperTable tasks={filteredTasks} onTaskClick={setSelectedTask} />
            )}
            
            {tasksMeta && (
              <Pagination 
                currentPage={tasksMeta.page}
                lastPage={tasksMeta.last_page}
                onPageChange={setPage}
              />
            )}
          </>
      )}

      {/* Shared Task Details Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[700px] bg-background border-border text-foreground rounded-[40px] p-0 overflow-hidden shadow-2xl flex flex-col h-[750px] animate-in zoom-in-95 duration-300">
          <div className="p-10 bg-card/20 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 -mr-10 -mt-10 rounded-full bg-brand/5 blur-3xl" />
            
            <DialogHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Badge className="bg-brand/10 text-brand border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest h-8">
                    {selectedTask?.project?.name || "Global Project"}
                    </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                    <Calendar className="size-4" />
                    Due: {selectedTask?.due_date ? format(new Date(selectedTask.due_date), "MMM dd, yyyy") : "Open"}
                </div>
              </div>
              <DialogTitle className="text-4xl font-black leading-tight">{selectedTask?.title}</DialogTitle>
              <DialogDescription className="mt-4 text-lg text-muted-foreground font-medium">
                {selectedTask?.description || "In-depth project objectives and requirements."}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 flex items-end gap-6 relative z-10">
                <div className="flex flex-col gap-2 flex-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 ml-1">Update Status</span>
                    <Select value={selectedTask?.status} onValueChange={val => selectedTask && updateStatus(selectedTask.id, val)}>
                        <SelectTrigger className="bg-background/80 border-border/50 rounded-2xl h-14 font-bold text-base shadow-inner">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border rounded-2xl">
                            <SelectItem value="todo" className="font-bold">Todo</SelectItem>
                            <SelectItem value="in_progress" className="font-bold">In Progress</SelectItem>
                            <SelectItem value="done" className="font-bold">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Discussion Area */}
          <div className="flex-1 overflow-hidden">
            {selectedTask && <TaskDiscussion taskId={selectedTask.id} userName={user.name} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
