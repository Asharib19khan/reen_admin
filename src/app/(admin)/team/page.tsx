import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/AdminPageHeader";
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
      <AdminPageHeader
        title="Team"
        description="Invite staff and manage roles for the admin vault."
      />
      
      <AddMemberForm />

      <div className="admin-panel overflow-hidden">
        <TeamTable initialMembers={teamMembers || []} currentUserId={session?.user.id || ""} />
      </div>
    </div>
  );
}
