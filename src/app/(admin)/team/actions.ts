"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addTeamMember(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !role) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const supabaseAdmin = createAdminClient();

  // 1. Create the user in Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData.user.id;

  // 2. The trigger automatically created them as 'employee', so we update it to the requested role if needed
  if (role !== "employee") {
    const { error: updateError } = await supabaseAdmin
      .from("user_roles")
      .update({ role })
      .eq("id", userId);

    if (updateError) {
      return { error: "User created, but failed to assign role: " + updateError.message };
    }
  }

  revalidatePath("/team");
  return { success: true };
}

export async function removeTeamMember(userId: string) {
  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    return { error: error.message };
  }

  // The cascade delete on user_roles will automatically remove the row
  revalidatePath("/team");
  return { success: true };
}
