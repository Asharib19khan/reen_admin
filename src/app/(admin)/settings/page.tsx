import { createClient } from "@/utils/supabase/server";
import { AdminPageHeader } from "@/components/AdminPageHeader";
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
      <AdminPageHeader
        title="Settings"
        description="Payment details and global storefront configuration."
      />
      <SettingsForm initialPaymentDetails={setting?.value || ""} />
    </div>
  );
}
