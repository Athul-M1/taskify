"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  MessageSquare, 
  Send,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user?: { name: string };
}

interface TaskDiscussionProps {
  taskId: string;
  userName?: string;
}

export function TaskDiscussion({ taskId, userName }: TaskDiscussionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`);
      if (res.ok) {
        setComments(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsPostingComment(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
        <div className="flex items-center justify-between mb-2">
            <h4 className="text-xl font-bold flex items-center gap-3">
                <MessageSquare className="size-6 text-brand" />
                Community Updates
            </h4>
            <Badge variant="outline" className="text-[11px] font-black text-muted-foreground uppercase">{comments.length} UPDATES</Badge>
        </div>

        <div className="space-y-8">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-5 group items-start">
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/20 shadow-sm group-hover:border-brand/30 transition-all">
                        <UserIcon className="size-5 text-muted-foreground group-hover:text-brand" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-sm font-black flex items-center gap-2">
                                {comment.user?.name || "Member"}
                                {userName && comment.user?.name === userName && <Badge className="h-4 px-1.5 text-[8px] bg-brand/10 text-brand border-none">YOU</Badge>}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{format(new Date(comment.created_at), "MMM dd • HH:mm")}</span>
                        </div>
                        
                        <div className="bg-muted/20 p-5 rounded-[28px] rounded-tl-none border border-border/10 group-hover:bg-muted/30 transition-colors">
                            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            {comments.length === 0 && !isLoading && (
                <div className="text-center py-16 opacity-30">
                    <MessageSquare className="size-12 mx-auto mb-4" />
                    <p className="font-black text-xs uppercase tracking-widest">No updates logged yet</p>
                </div>
            )}
            {isLoading && (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin size-6 text-brand" /></div>
            )}
        </div>
      </div>

      <div className="p-8 bg-card/10 border-t border-border/50">
          <form onSubmit={postComment} className="flex items-center gap-4">
              <Textarea 
                placeholder="Reply or contribute to the briefing..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 min-h-[56px] h-14 bg-background border-border/50 rounded-2xl resize-none py-4 px-6 focus-visible:ring-1 focus-visible:ring-brand font-medium shadow-sm transition-all"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!newComment.trim() || isPostingComment}
                className="h-14 w-14 rounded-2xl bg-brand hover:bg-brand-hover text-white flex-shrink-0 shadow-xl shadow-brand/20 transition-all active:scale-95"
              >
                {isPostingComment ? <Loader2 className="animate-spin size-6" /> : <Send className="size-6" />}
              </Button>
          </form>
      </div>
    </div>
  );
}
