export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  task_count?: number;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user?: { name: string };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  project_id: string;
  assigned_to: string | null;
  project?: Project;
  assignee?: User;
  due_date?: string;
  created_at?: string;
}
