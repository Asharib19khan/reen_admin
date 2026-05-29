"use server";

import { revalidatePath } from "next/cache";
import { requireCatalogManager } from "@/lib/admin-role";
import { createAdminClient } from "@/utils/supabase/admin";

function getAdminClient() {
  return createAdminClient();
}

async function removeBannerRowsByTitle(supabase: ReturnType<typeof getAdminClient>, title: string) {
  const { data: existing } = await supabase
    .from("hero_banners")
    .select("id, media_url")
    .eq("title", title);

  if (!existing?.length) return;

  for (const banner of existing) {
    const filename = banner.media_url.split("/").pop();
    if (filename) {
      await supabase.storage.from("media").remove([filename]);
    }
    await supabase.from("hero_banners").delete().eq("id", banner.id);
  }
}

export async function addBanner(formData: FormData) {
  await requireCatalogManager();

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

  await removeBannerRowsByTitle(supabase, title);

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
  await requireCatalogManager();

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
  await requireCatalogManager();

  const supabase = getAdminClient();
  const { error } = await supabase.from("hero_banners").update({ is_active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/media");
}
