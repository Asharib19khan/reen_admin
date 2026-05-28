import { AdminNav } from "@/components/AdminNav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userRoleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role =
    user.email?.toLowerCase() === "yeezus196@gmail.com"
      ? "super_admin"
      : userRoleData?.role || "employee";

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
