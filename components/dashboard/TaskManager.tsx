"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2, Filter, User as UserIcon, CheckCircle2, Cloud, Calendar, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { Project, User, Task } from "@/lib/types/dashboard";
import { AdminTaskForm } from "./AdminTaskForm";
import { AdminTaskTable } from "./AdminTaskTable";
import { TaskDiscussion } from "./TaskDiscussion";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Pagination } from "./Pagination";

export function TaskManager() {
  const { 
    tasks, 
    projects, 
    users, 
    tasksMeta,
    isLoadingTasks: isLoading,
    fetchTasks,
    fetchProjects,
    fetchUsers,
    deleteTask
  } = useDashboardStore();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Discussion state
  const [selectedTaskForComments, setSelectedTaskForComments] = useState<Task | null>(null);

  // Filter & Pagination state
  const [filterProject, setFilterProject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    // These will use cache if already fetched
    fetchProjects();
    fetchUsers();
    fetchTasks({ 
      project_id: filterProject === "all" ? "" : filterProject, 
      status: filterStatus === "all" ? "" : filterStatus, 
      assigned_to: filterUser === "all" ? "" : filterUser,
      date: filterDate === "all" ? "" : filterDate,
      page: page
    });
  };

  useEffect(() => {
    fetchData();
  }, [filterProject, filterStatus, filterUser, filterDate, page]);

  const handleDelete = (id: string) => {
    toast("Delete Task", {
      description: "Are you sure you want to delete this task?",
      action: {
        label: "Delete",
        onClick: async () => await deleteTask(id)
      }
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleReview = (task: Task) => {
      setSelectedTaskForComments(task);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Tasks Oversight</h2>
          <p className="text-muted-foreground mt-1 text-base">Centralized management for all active development tasks.</p>
        </div>
        <Button 
            onClick={() => { setEditingTask(null); setShowForm(true); }}
            className="rounded-xl h-11 px-6 shadow-lg transition-all font-bold"
        >
          <Plus className="mr-2 h-5 w-5" /> Create Task
        </Button>
      </div>

      <AdminTaskForm 
        open={showForm} 
        onOpenChange={setShowForm} 
        editingTask={editingTask} 
        projects={projects} 
        users={users} 
        onSuccess={fetchTasks} 
      />

      {/* Filters Area */}
      <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-card/40 border border-border/50 backdrop-blur-md">
            <Cloud className="size-4 text-brand" />
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="bg-transparent h-auto p-0 border-none outline-none font-semibold text-sm focus:ring-0 ring-offset-0 whitespace-nowrap min-w-[120px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-xl">
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-card/40 border border-border/50 backdrop-blur-md">
            <CheckCircle2 className="size-4 text-brand" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-transparent h-auto p-0 border-none outline-none font-semibold text-sm focus:ring-0 ring-offset-0 whitespace-nowrap min-w-[120px]">
                <SelectValue placeholder="Any Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-xl">
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-card/40 border border-border/50 backdrop-blur-md">
            <UserIcon className="size-4 text-brand" />
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="bg-transparent h-auto p-0 border-none outline-none font-semibold text-sm focus:ring-0 ring-offset-0 whitespace-nowrap min-w-[120px]">
                <SelectValue placeholder="Everyone" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-xl">
                <SelectItem value="all">Everyone</SelectItem>
                {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-card/40 border border-border/50 backdrop-blur-md">
            <Calendar className="size-4 text-brand" />
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="bg-transparent h-auto p-0 border-none outline-none font-semibold text-sm focus:ring-0 ring-offset-0 whitespace-nowrap min-w-[120px]">
                <SelectValue placeholder="Timeline" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-xl">
                <SelectItem value="all">Anytime</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="h-11 rounded-xl border-border/50 bg-card/40 backdrop-blur-md gap-2 font-bold transition-all hover:bg-accent/30" onClick={() => { setFilterProject("all"); setFilterStatus("all"); setFilterUser("all"); setFilterDate("all"); }}>
            <Filter className="size-4" />
            Clear Filters
          </Button>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur-2xl overflow-hidden rounded-3xl">
        {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-brand" /></div>
        ) : (
          <div className="flex flex-col">
            <AdminTaskTable 
                tasks={tasks} 
                onReview={handleReview} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />
            {tasksMeta && (
              <Pagination 
                currentPage={tasksMeta.page}
                lastPage={tasksMeta.last_page}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </Card>

      {!isLoading && tasks.length === 0 && (
        <div className="text-center p-20 bg-muted/10 rounded-3xl border-2 border-dashed border-border/50">
          <p className="text-muted-foreground font-medium">No tasks found in the database matching these criteria.</p>
        </div>
      )}

      {/* Discussion Modal for Admin */}
      <Dialog open={!!selectedTaskForComments} onOpenChange={(open) => !open && setSelectedTaskForComments(null)}>
        <DialogContent className="sm:max-w-[650px] bg-background border-border text-foreground rounded-[40px] p-0 overflow-hidden shadow-2xl flex flex-col h-[700px] animate-in zoom-in-95 duration-300">
          <div className="p-10 bg-card/20 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 -mr-10 -mt-10 rounded-full bg-brand/5 blur-3xl" />
            
            <DialogHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-brand/10 text-brand border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest h-8">
                  {selectedTaskForComments?.project?.name || "Global Project"}
                </Badge>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                    <Calendar className="size-4" />
                    Due: {selectedTaskForComments?.due_date ? format(new Date(selectedTaskForComments.due_date), "MMM dd, yyyy") : "Open"}
                </div>
              </div>
              <DialogTitle className="text-4xl font-black leading-tight">{selectedTaskForComments?.title}</DialogTitle>
              <DialogDescription className="mt-4 text-lg text-muted-foreground font-medium">
                {selectedTaskForComments?.description || "High-level task briefing and requirements."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <Separator className="bg-border/50" />

          {/* Discussion Area */}
          <div className="flex-1 overflow-hidden">
            {selectedTaskForComments && <TaskDiscussion taskId={selectedTaskForComments.id} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
