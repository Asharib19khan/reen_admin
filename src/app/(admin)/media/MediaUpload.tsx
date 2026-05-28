"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addBanner } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { Plus, X } from "lucide-react";

export function MediaUpload() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("is_active", isActive.toString());
      formData.set("file", file);
      
      await addBanner(formData);
      
      setOpen(false);
      setFile(null);
      setIsActive(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Media</Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md p-6 rounded-xl shadow-lg border border-border relative">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-bold mb-6">Upload Hero Media</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (Internal reference)</Label>
                <Input id="title" name="title" required placeholder="e.g., Summer Collection" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="media_type">Media Type</Label>
                <select 
                  name="media_type" 
                  style={{ colorScheme: 'dark' }}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue="image"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File Upload</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept="image/*,video/*" 
                  required 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex items-center justify-between border border-input rounded-md p-3 mt-4">
                <div className="space-y-0.5">
                  <Label>Set as Active</Label>
                  <p className="text-xs text-muted-foreground">Active media will show in the storefront hero.</p>
                </div>
                <Switch 
                  checked={isActive} 
                  onCheckedChange={setIsActive} 
                />
              </div>

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? "Uploading..." : "Save Media"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
