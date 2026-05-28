import { createClient } from "@/utils/supabase/server";
import { MediaSlot } from "./MediaSlot";

export const revalidate = 0;

export default async function MediaPage() {
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
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Media Slots</h1>
        <p className="text-muted-foreground mt-1">Efficiently manage predefined media sections across your storefront.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-card border border-border rounded-xl shadow-sm divide-y">
          <div className="bg-muted/30 p-4 border-b border-border">
            <h2 className="text-xl font-bold">Home Page Hero</h2>
          </div>
          <MediaSlot 
            title="Home_page_hero_desktop" 
            description="Desktop View (For laptops & large screens). Recommended Size: 1920x1080 (16:9 Widescreen)."
            banner={getBanner("Home_page_hero_desktop")} 
          />
          <MediaSlot 
            title="Home_page_hero_mobile" 
            description="Mobile View (For phones). Recommended Size: 1080x1920 (9:16 Vertical/Portrait)."
            banner={getBanner("Home_page_hero_mobile")} 
          />
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm divide-y">
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

        <div className="bg-card border border-border rounded-xl shadow-sm divide-y">
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
