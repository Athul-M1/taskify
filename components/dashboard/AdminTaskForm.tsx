"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Layout, User as UserIcon, Flag, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Project, User, Task } from "@/lib/types/dashboard";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: Task | null;
  projects: Project[];
  users: User[];
  onSuccess: () => void;
}

export function AdminTaskForm({ open, onOpenChange, editingTask, projects, users, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setProjectId(editingTask.project_id);
      setAssignedTo(editingTask.assigned_to || "");
      setStatus(editingTask.status);
      setDueDate(editingTask.due_date ? new Date(editingTask.due_date) : undefined);
    } else {
      setTitle("");
      setDescription("");
      setProjectId("");
      setAssignedTo("");
      setStatus("todo");
      setDueDate(undefined);
    }
  }, [editingTask, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          project_id: projectId,
          assigned_to: assignedTo === "unassigned" ? null : (assignedTo || null),
          status,
          due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null
        }),
      });

      if (res.ok) {
        onSuccess();
        onOpenChange(false);
        toast.success(editingTask ? "Task updated successfully" : "Task created successfully");
      } else {
        toast.error("Failed to save task. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save task", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-background border-border text-foreground rounded-[24px] p-8 shadow-2xl backdrop-blur-xl">
        <DialogHeader className="relative pr-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-sm font-medium">
            Define project scope and assign ownership.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Task Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="e.g. Refresh Brand Guidelines" 
              className="h-12 bg-muted/50 border-border/50 rounded-xl text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand/50" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Description</Label>
            <Textarea 
              id="desc" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe the outcome of this task..." 
              className="min-h-[100px] bg-muted/50 border-border/50 rounded-xl text-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand/50 resize-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Project</Label>
              <Select value={projectId} onValueChange={setProjectId} required>
                <SelectTrigger className="size-full min-h-[48px] bg-muted/50 border-border/50 rounded-xl text-sm justify-between">
                  <div className="flex items-center gap-2">
                      <Layout className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="Select Project" data-testid="select-project-value" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  {projects.map(p => <SelectItem key={p.id} value={p.id} className="focus:bg-brand/20 transition-colors cursor-pointer">{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Assignee</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="size-full min-h-[48px] bg-muted/50 border-border/50 rounded-xl text-sm">
                  <div className="flex items-center gap-2">
                      <UserIcon className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="Select User" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  <SelectItem value="unassigned" className="focus:bg-brand/20 transition-colors cursor-pointer">Unassigned</SelectItem>
                  {users.map(u => <SelectItem key={u.id} value={u.id} className="focus:bg-brand/20 transition-colors cursor-pointer">{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="size-full min-h-[48px] bg-muted/50 border-border/50 rounded-xl text-sm">
                  <div className="flex items-center gap-2">
                       <Flag className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  <SelectItem value="todo" className="focus:bg-brand/20 cursor-pointer">Todo</SelectItem>
                  <SelectItem value="in_progress" className="focus:bg-brand/20 cursor-pointer">In Progress</SelectItem>
                  <SelectItem value="done" className="focus:bg-brand/20 cursor-pointer">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={cn("h-12 w-full bg-muted/50 border-border/50 rounded-xl text-sm justify-start font-normal px-3 hover:bg-muted/70", !dueDate && "text-muted-foreground")}>
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {dueDate ? format(dueDate, "MM/dd/yyyy") : <span>mm/dd/yyyy</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border rounded-xl" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl font-bold transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl font-bold shadow-lg transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
