import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TeamTable } from "./TeamTable";
import { AddMemberForm } from "./AddMemberForm";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", session?.user.id)
    .single();

  const role = session?.user.email?.toLowerCase() === 'yeezus196@gmail.com' ? 'super_admin' : userRole?.role;

  if (role !== "super_admin") {
    redirect("/");
  }

  const { data: teamMembers } = await supabase
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
      </div>
      
      <AddMemberForm />

      <div className="bg-card border border-border">
        <TeamTable initialMembers={teamMembers || []} currentUserId={session?.user.id || ""} />
      </div>
    </div>
  );
}
