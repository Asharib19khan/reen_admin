import { createClient } from "@/utils/supabase/server";
import { SettingsForm } from "./SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
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

  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "payment_details")
    .single();

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <SettingsForm initialPaymentDetails={setting?.value || ""} />
    </div>
  );
}
