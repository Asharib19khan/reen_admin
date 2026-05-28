"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Image as ImageIcon, Video } from "lucide-react";
import { deleteBanner, toggleBannerActive } from "./actions";

export function MediaTable({ initialBanners }: { initialBanners: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;
    setLoadingId(id);
    await deleteBanner(id, url);
    setLoadingId(null);
  };

  const handleToggle = async (id: string, active: boolean) => {
    setLoadingId(id);
    await toggleBannerActive(id, active);
    setLoadingId(null);
  };

  if (initialBanners.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No media uploaded yet.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Preview</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialBanners.map((banner) => (
          <TableRow key={banner.id}>
            <TableCell>
              <div className="relative w-24 h-16 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                {banner.media_type === 'image' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={banner.media_url} alt={banner.title} className="object-cover w-full h-full" />
                ) : (
                  <Video className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
            </TableCell>
            <TableCell>
              <p className="font-medium">{banner.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] uppercase">
                  {banner.media_type === 'image' ? <ImageIcon className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                  {banner.media_type}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={banner.is_active} 
                  onCheckedChange={(c) => handleToggle(banner.id, c)}
                  disabled={loadingId === banner.id}
                />
                <span className="text-sm text-muted-foreground">{banner.is_active ? 'Active' : 'Hidden'}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(banner.id, banner.media_url)}
                disabled={loadingId === banner.id}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
