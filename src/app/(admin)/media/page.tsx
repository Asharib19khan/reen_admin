import { createClient } from "@/utils/supabase/server";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { MediaSlot } from "./MediaSlot";
import { canManageCatalog, getAdminRole } from "@/lib/admin-role";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function MediaPage() {
  const auth = await getAdminRole();
  if (!auth || !canManageCatalog(auth.role)) {
    redirect("/");
  }

  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("hero_banners")
    .select("*")
    .in("title", [
      "Home_page_hero_desktop", "Home_page_hero_mobile", 
      "byreen.xo_page_hero_desktop", "byreen.xo_page_hero_mobile", 
      "luxereen.wears_page_hero_desktop", "luxereen.wears_page_hero_mobile"
    ]);

  const getBanner = (title: string) => banners?.find(b => b.title === title) || null;

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8">
      <AdminPageHeader
        title="Media Slots"
        description="Manage predefined hero banners across your storefront."
      />

      <div className="space-y-8">
        <div className="admin-panel divide-y overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <h2 className="text-xl font-bold">Home Page Hero</h2>
          </div>
          <MediaSlot 
            title="Home_page_hero_desktop" 
            description="Desktop View. Recommended Size: 1920x1080 (16:9 Widescreen for full-screen Nishat style layout)."
            banner={getBanner("Home_page_hero_desktop")} 
          />
          <MediaSlot 
            title="Home_page_hero_mobile" 
            description="Mobile View. Recommended Size: 1080x1920 (9:16 Vertical/Portrait for full-screen immersive layout)."
            banner={getBanner("Home_page_hero_mobile")} 
          />
        </div>

        <div className="admin-panel divide-y overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <h2 className="text-xl font-bold">byreen.xo Section Hero</h2>
          </div>
          <MediaSlot 
            title="byreen.xo_page_hero_desktop" 
            description="Desktop View. Recommended Size: 1920x600 (Ultra-wide panorama, 3:1 ratio)."
            banner={getBanner("byreen.xo_page_hero_desktop")} 
          />
          <MediaSlot 
            title="byreen.xo_page_hero_mobile" 
            description="Mobile View. Recommended Size: 1080x1080 (1:1 Square) or 1080x1350 (4:5 Portrait)."
            banner={getBanner("byreen.xo_page_hero_mobile")} 
          />
        </div>

        <div className="admin-panel divide-y overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border">
            <h2 className="text-xl font-bold">luxereen.wears Section Hero</h2>
          </div>
          <MediaSlot 
            title="luxereen.wears_page_hero_desktop" 
            description="Desktop View. Recommended Size: 1920x600 (Ultra-wide panorama, 3:1 ratio)."
            banner={getBanner("luxereen.wears_page_hero_desktop")} 
          />
          <MediaSlot 
            title="luxereen.wears_page_hero_mobile" 
            description="Mobile View. Recommended Size: 1080x1080 (1:1 Square) or 1080x1350 (4:5 Portrait)."
            banner={getBanner("luxereen.wears_page_hero_mobile")} 
          />
        </div>
      </div>
    </div>
  );
}
