"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle2, 
  User as UserIcon, 
  MessageSquare, 
  Edit2, 
  Trash2 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types/dashboard";

interface AdminTaskTableProps {
  tasks: Task[];
  onReview: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function AdminTaskTable({ tasks, onReview, onEdit, onDelete }: AdminTaskTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[800px] md:min-w-full">
          <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/20">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Title</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Assigned User</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Due Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Project Name</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6">Actions</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {tasks.map((task) => (
                  <TableRow key={task.id} className="border-border/10 hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-6 py-5">
                          <div className="flex items-center gap-3">
                              {task.status === "done" ? <CheckCircle2 className="size-5 text-emerald-500" /> : <FileText className="size-5 text-muted-foreground group-hover:text-brand transition-colors" />}
                              <span className={cn("font-semibold text-base whitespace-nowrap", task.status === "done" && "text-muted-foreground line-through decoration-emerald-500/50")}>{task.title}</span>
                          </div>
                      </TableCell>
                      <TableCell className="text-center">
                          <Badge 
                              variant={task.status === "done" ? "success" : task.status === "in_progress" ? "warning" : "secondary"}
                              className="h-7 px-3 text-[10px] uppercase tracking-widest font-black"
                          >
                              {task.status.replace("_", " ")}
                          </Badge>
                      </TableCell>
                      <TableCell>
                          <div className="flex items-center gap-2.5 whitespace-nowrap">
                              <div className="h-8 w-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                                  <UserIcon className="size-4" />
                              </div>
                              <span className="text-sm font-medium">{task.assignee ? task.assignee.name : "System"}</span>
                          </div>
                      </TableCell>
                      <TableCell>
                          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                              {task.due_date ? format(new Date(task.due_date), "MMM dd, yyyy") : "No limit"}
                          </span>
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline" className="border-brand/20 text-brand bg-brand/5 font-bold h-7 px-3 whitespace-nowrap">
                              {task.project?.name || "System"}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-brand/10 hover:text-brand" onClick={() => onReview(task)}>
                                  <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-brand/10 hover:text-brand" onClick={() => onEdit(task)}>
                                  <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(task.id)}>
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </div>
                      </TableCell>
                  </TableRow>
              ))}
          </TableBody>
      </Table>
    </div>
  );
}
