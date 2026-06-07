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

  const { data: settings } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["payment_details", "hide_byreen_xo", "hide_luxereen_wears"]);

  const getSetting = (key: string, defaultValue: string = "") => {
    return settings?.find(s => s.key === key)?.value || defaultValue;
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <AdminPageHeader
        title="Settings"
        description="Payment details and global storefront configuration."
      />
      <SettingsForm 
        initialPaymentDetails={getSetting("payment_details")}
        initialHideByreen={getSetting("hide_byreen_xo") === "true"}
        initialHideLuxereen={getSetting("hide_luxereen_wears") === "true"}
      />
    </div>
  );
}
