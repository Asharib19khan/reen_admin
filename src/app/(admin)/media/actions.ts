"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function addBanner(formData: FormData) {
  const supabase = getAdminClient();
  const title = formData.get("title") as string;
  const media_type = formData.get("media_type") as string;
  const is_active = formData.get("is_active") === "true";
  const file = formData.get("file") as File;

  if (!file) throw new Error("File is required");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);

  const { error } = await supabase.from("hero_banners").insert({
    title,
    media_url: publicUrlData.publicUrl,
    media_type,
    is_active,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/media");
}

export async function deleteBanner(id: string, media_url: string) {
  const supabase = getAdminClient();
  
  const filename = media_url.split('/').pop();
  if (filename) {
    await supabase.storage.from('media').remove([filename]);
  }

  const { error } = await supabase.from("hero_banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/media");
}

export async function toggleBannerActive(id: string, is_active: boolean) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("hero_banners").update({ is_active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/media");
}
