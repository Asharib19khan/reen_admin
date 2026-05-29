import { createClient } from "@/utils/supabase/server";
import { SettingsForm } from "./SettingsForm";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/admin-role";

export default async function SettingsPage() {
  try {
    await requireSuperAdmin();
  } catch {
    redirect("/");
  }

  const supabase = await createClient();

  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "payment_details")
    .maybeSingle();

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <SettingsForm initialPaymentDetails={setting?.value || ""} />
    </div>
  );
}
