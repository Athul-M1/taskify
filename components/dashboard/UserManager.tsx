"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User as UserIcon, Mail, Shield } from "lucide-react";
import { Badge } from "../ui/badge";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Pagination } from "./Pagination";

export function UserManager() {
  const { users, usersMeta, isLoadingUsers: isLoading, fetchUsers } = useDashboardStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-brand" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="relative overflow-hidden group hover:ring-2 hover:ring-brand/50 transition-all border-border/50 bg-card/50 backdrop-blur-xl">
             <div className="absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 rounded-full bg-brand/5 group-hover:bg-brand/10 transition-colors" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                    <UserIcon className="size-5" />
                </div>
                <div>
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Mail className="size-3" />
                        {user.email}
                    </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1.5 mt-2">
                <Shield className="size-3.5 text-brand" />
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                    {user.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {usersMeta && (
        <Pagination 
          currentPage={usersMeta.page}
          lastPage={usersMeta.last_page}
          onPageChange={setPage}
        />
      )}

      {users.length === 0 && (
        <div className="text-center p-12 bg-muted/20 rounded-xl border border-dashed border-border/50">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}
    </div>
  );
}
