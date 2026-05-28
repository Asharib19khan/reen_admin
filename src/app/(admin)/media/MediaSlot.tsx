"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Video, Upload, Trash2 } from "lucide-react";
import { addBanner, deleteBanner } from "./actions";

export function MediaSlot({ title, description, banner }: { title: string, description: string, banner: any }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      if (banner) {
        await deleteBanner(banner.id, banner.media_url);
      }

      const formData = new FormData();
      formData.set("title", title);
      formData.set("media_type", file.type.startsWith("video/") ? "video" : "image");
      formData.set("is_active", "true"); 
      formData.set("file", file);

      await addBanner(formData);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!banner) return;
    if (!confirm("Are you sure you want to remove this media?")) return;
    setLoading(true);
    await deleteBanner(banner.id, banner.media_url);
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="flex items-center gap-6">
        {banner ? (
          <>
            <div className="relative w-40 h-24 bg-muted rounded-md overflow-hidden flex items-center justify-center border border-border shadow-sm">
              {banner.media_type === 'image' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={banner.media_url} alt={banner.title} className="object-cover w-full h-full" />
              ) : (
                <Video className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-2 min-w-[120px]">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={loading} className="w-full">
                {loading ? "Uploading..." : "Replace"}
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 w-full" onClick={handleDelete} disabled={loading}>
                Remove
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-40 h-24 bg-muted/30 rounded-md border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="w-6 h-6 mb-2 opacity-40" />
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-60">Empty Slot</span>
            </div>
            <div className="flex flex-col gap-2 min-w-[120px]">
              <Button onClick={() => fileInputRef.current?.click()} disabled={loading} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {loading ? "..." : "Upload"}
              </Button>
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*" 
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}
