"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { isSupabaseConfigured } from "@/utils/supabase/env"

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Server is not configured. Contact the administrator.")
  }

  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/login?error=Invalid credentials")
  }

  revalidatePath("/", "layout")
  redirect("/")
}
