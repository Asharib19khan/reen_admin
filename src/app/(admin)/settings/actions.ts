"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { requireSuperAdmin } from "@/lib/admin-role";
import { revalidatePath } from "next/cache";

export async function saveStorefrontSettings(settingsToSave: { key: string; value: string }[]) {
  try {
    await requireSuperAdmin();
  } catch {
    return { error: "Unauthorized" };
  }

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin.from("settings").upsert(
    settingsToSave,
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout"); // Revalidate storefront layout if needed, though they are separate apps.
  return { success: true };
}
