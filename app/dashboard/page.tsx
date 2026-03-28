import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/get-user";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 p-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <LogoutButton />
      </header>
      <p className="text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{user.name}</span> ({user.email})
      </p>
    </div>
  );
}
