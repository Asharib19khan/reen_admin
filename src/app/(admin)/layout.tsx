import { AdminNav } from "@/components/AdminNav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: userRoleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  const role = session.user.email?.toLowerCase() === 'yeezus196@gmail.com' 
    ? 'super_admin' 
    : (userRoleData?.role || "employee");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminNav role={role} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
