"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Plus } from "lucide-react";
import Image from "next/image";

interface ProductVariant {
  id?: string;
  color: string;
  size: string;
  quantity: number;
  sku: string;
}

const BYREEN_CATEGORIES = [
  "Rings",
  "Bracelets & Anklets",
  "Earrings",
  "Necklaces",
  "Bangles (Churiyaan)",
  "Other"
];

const LUXEREEN_CATEGORIES = [
  "Corset Co-ord Sets",
  "Solid & Casual Two-Piece Co-ords",
  "Fusion & Printed Kurtis",
  "Traditional Fusion Coordinates",
  "Western-Fusion Styling & Skirt Outfits",
  "Other"
];

export function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.product_variants || []
  );
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    brand: initialData?.brand || "byreen_xo",
    category: initialData?.category || "Rings",
    quantity: initialData?.quantity || 0,
    is_active: initialData?.is_active ?? true,
    is_new_arrival: initialData?.is_new_arrival ?? false,
    is_best_selling: initialData?.is_best_selling ?? false,
    image_urls: initialData?.image_urls || [],
    hero_image_concept: initialData?.hero_image_concept || "",
    view_360_url: initialData?.view_360_url || "",
    video_url: initialData?.video_url || "",
    color_options: initialData?.color_options || "",
    size_matrix: initialData?.size_matrix || "",
    has_custom_measurement: initialData?.has_custom_measurement ?? false,
    interactive_addons: initialData?.interactive_addons || "",
    hook_text: initialData?.hook_text || "",
    deep_dive_description: initialData?.deep_dive_description || "",
    fabric_care: initialData?.fabric_care || "",
    sizing_note: initialData?.sizing_note || "",
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const newUrls = [...formData.image_urls];
    
    for (const file of Array.from(e.target.files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        continue;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      newUrls.push(data.publicUrl);
    }
    
    setFormData({ ...formData, image_urls: newUrls });
    
    if (initialData?.id) {
      await supabase.from("products").update({ image_urls: newUrls }).eq("id", initialData.id);
      router.refresh();
    }
    
    setUploading(false);
  };

  const removeImage = async (index: number) => {
    const urlToRemove = formData.image_urls[index];
    const newUrls = [...formData.image_urls];
    newUrls.splice(index, 1);
    setFormData({ ...formData, image_urls: newUrls });

    try {
      if (urlToRemove) {
        const urlObj = new URL(urlToRemove);
        const parts = urlObj.pathname.split('/');
        const fileName = parts[parts.length - 1];
        if (fileName) {
          await supabase.storage.from('product-images').remove([fileName]);
        }
      }
    } catch (e) {
      console.error("Storage removal error:", e);
    }

    if (initialData?.id) {
      await supabase.from("products").update({ image_urls: newUrls }).eq("id", initialData.id);
      router.refresh();
    }
  };

  const removeSingleFile = async (field: 'view_360_url' | 'video_url') => {
    const urlToRemove = formData[field] as string;
    setFormData({ ...formData, [field]: "" });
    
    try {
      if (urlToRemove) {
        const urlObj = new URL(urlToRemove);
        const parts = urlObj.pathname.split('/');
        const fileName = parts[parts.length - 1];
        if (fileName) {
          await supabase.storage.from('product-images').remove([fileName]);
        }
      }
    } catch (e) {
      console.error("Storage removal error:", e);
    }

    if (initialData?.id) {
      await supabase.from("products").update({ [field]: "" }).eq("id", initialData.id);
      router.refresh();
    }
  };

  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'view_360_url' | 'video_url') => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
    } else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setFormData({ ...formData, [field]: data.publicUrl });
      
      if (initialData?.id) {
        await supabase.from("products").update({ [field]: data.publicUrl }).eq("id", initialData.id);
        router.refresh();
      }
    }
    
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let error: any = null;
    
    // Clean data payload, avoiding any prototype pollution or undefined values
    const payload = JSON.parse(JSON.stringify(formData));
    
    try {
      let productId = initialData?.id;
      if (initialData?.id) {
        const result = await supabase.from("products").update(payload).eq("id", initialData.id);
        error = result.error;
      } else {
        const result = await supabase.from("products").insert([payload]).select().single();
        error = result.error;
        if (result.data) productId = result.data.id;
      }

      if (!error && productId) {
        if (variants.length > 0) {
          const variantsToUpsert = variants.map(v => ({
            ...(v.id ? { id: v.id } : {}),
            product_id: productId,
            color: v.color || null,
            size: v.size || null,
            quantity: v.quantity || 0,
            sku: v.sku || null
          }));
          
          if (initialData?.id) {
             const currentVariantIds = variants.map(v => v.id).filter(Boolean);
             if (currentVariantIds.length > 0) {
                await supabase.from("product_variants").delete().eq("product_id", productId).not("id", "in", `(${currentVariantIds.join(',')})`);
             } else {
                await supabase.from("product_variants").delete().eq("product_id", productId);
             }
          }
          const variantResult = await supabase.from("product_variants").upsert(variantsToUpsert);
          if (variantResult.error) throw variantResult.error;
        } else if (initialData?.id) {
          await supabase.from("product_variants").delete().eq("product_id", productId);
        }
      }
    } catch (err: any) {
      error = err;
    }

    if (error) {
      const errorMsg = error?.message || error?.details || JSON.stringify(error) || "Unknown error";
      alert("Failed to save product:\n\n" + errorMsg);
      console.error("Product save error details:", error);
      setLoading(false);
      return;
    }

    router.push("/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input 
                id="title" required 
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <select 
                id="brand" required
                value={formData.brand} 
                onChange={(e) => {
                  const newBrand = e.target.value as any;
                  setFormData({
                    ...formData, 
                    brand: newBrand,
                    category: newBrand === 'byreen_xo' ? BYREEN_CATEGORIES[0] : LUXEREEN_CATEGORIES[0]
                  });
                }}
                style={{ colorScheme: 'dark' }}
                className="flex h-9 w-full border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="byreen_xo">byreen.xo</option>
                <option value="luxereen_wears">luxereen.wears</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs.)</Label>
              <Input 
                id="price" type="number" required min="0" step="0.01"
                value={formData.price ?? ""} 
                onChange={(e) => setFormData({...formData, price: e.target.value === "" ? 0 : parseFloat(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Stock Quantity</Label>
              <Input 
                id="quantity" type="number" required min="0"
                value={formData.quantity ?? ""} 
                onChange={(e) => setFormData({...formData, quantity: e.target.value === "" ? 0 : parseInt(e.target.value)})} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" required
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ colorScheme: 'dark' }}
                className="flex h-9 w-full border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {(formData.brand === 'byreen_xo' ? BYREEN_CATEGORIES : LUXEREEN_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4 md:col-span-2 pt-2 border-t border-border mt-2">
              <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={(c) => setFormData({...formData, is_active: c})} />
                <Label htmlFor="is_active">Active (Visible on Storefront)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_new_arrival" checked={formData.is_new_arrival} onCheckedChange={(c) => setFormData({...formData, is_new_arrival: c})} />
                <Label htmlFor="is_new_arrival">Mark as New Arrival</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_best_selling" checked={formData.is_best_selling} onCheckedChange={(c) => setFormData({...formData, is_best_selling: c})} />
                <Label htmlFor="is_best_selling">Mark as Best Selling (Home Page Featured)</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1. WEBSITE VISUAL & MEDIA MANIFEST</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <Label>Standard Product Images</Label>
            <div>
              <input type="file" id="image_upload" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              <Label htmlFor="image_upload" className="cursor-pointer inline-flex items-center justify-center h-9 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors border border-input">
                {uploading ? "Uploading..." : <><Upload className="mr-2 h-4 w-4" /> Upload Images</>}
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {formData.image_urls.map((url: string, idx: number) => (
              <div key={idx} className="relative group aspect-square border bg-muted">
                <Image src={url} alt={`Preview ${idx}`} fill sizes="100px" className="object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>360-Degree Rotatable 3D View</Label>
              <div className="flex gap-4 items-center">
                <Button type="button" variant="outline" className="relative cursor-pointer w-48" disabled={uploading}>
                  <Upload className="mr-2 h-4 w-4" /> 
                  Upload 3D Model
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e) => handleSingleFileUpload(e, 'view_360_url')} 
                    accept=".glb,.gltf"
                  />
                </Button>
                {formData.view_360_url && (
                  <div className="text-sm text-muted-foreground truncate w-64">
                    <a href={formData.view_360_url} target="_blank" className="hover:underline">{formData.view_360_url}</a>
                    <button type="button" onClick={() => removeSingleFile('view_360_url')} className="ml-2 text-destructive"><Trash2 className="h-4 w-4 inline" /></button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>5-10 Second Faceless Product Video</Label>
              <div className="flex gap-4 items-center">
                <Button type="button" variant="outline" className="relative cursor-pointer w-48" disabled={uploading}>
                  <Upload className="mr-2 h-4 w-4" /> 
                  Upload Video
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e) => handleSingleFileUpload(e, 'video_url')} 
                    accept="video/*"
                  />
                </Button>
                {formData.video_url && (
                  <div className="text-sm text-muted-foreground truncate w-64">
                    <a href={formData.video_url} target="_blank" className="hover:underline">{formData.video_url}</a>
                    <button type="button" onClick={() => removeSingleFile('video_url')} className="ml-2 text-destructive"><Trash2 className="h-4 w-4 inline" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. VARIANT ARCHITECTURE (SPECIFICATIONS)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Color Options / Metal Finishes</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "Black", "White", "Red", "Blue", "Navy", "Green", "Emerald", "Olive",
                "Yellow", "Mustard", "Pink", "Fuchsia", "Rose Gold", "Purple", "Lavender",
                "Maroon", "Burgundy", "Beige", "Nude", "Brown", "Grey", "Silver", "Gold",
                "Teal", "Turquoise", "Coral", "Orange", "Peach", "Mint", "Charcoal", "Pristine White", "Midnight Maroon"
              ].map(color => {
                const currentColors = formData.color_options.split(',').map((c: string) => c.trim()).filter(Boolean);
                const isSelected = currentColors.includes(color);
                return (
                  <Button
                    key={color}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs rounded-full"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({ ...formData, color_options: currentColors.filter((c: string) => c !== color).join(', ') });
                      } else {
                        setFormData({ ...formData, color_options: [...currentColors, color].join(', ') });
                      }
                    }}
                  >
                    {color}
                  </Button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Selected: {formData.color_options || "None"}</p>
          </div>

          <div className="space-y-3">
            <Label>Size Matrix</Label>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "Free Size"].map(size => {
                const currentSizes = formData.size_matrix.split(',').map((s: string) => s.trim()).filter(Boolean);
                const isSelected = currentSizes.includes(size);
                return (
                  <Button
                    key={size}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-12 text-xs font-semibold"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({ ...formData, size_matrix: currentSizes.filter((s: string) => s !== size).join(', ') });
                      } else {
                        setFormData({ ...formData, size_matrix: [...currentSizes, size].join(', ') });
                      }
                    }}
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Selected: {formData.size_matrix || "None"}</p>
          </div>
          <div className="flex items-center space-x-2 pt-2 pb-2">
            <Switch id="has_custom_measurement" checked={formData.has_custom_measurement} onCheckedChange={(c) => setFormData({...formData, has_custom_measurement: c})} />
            <Label htmlFor="has_custom_measurement">Enable 'Custom Measurement' field at checkout</Label>
          </div>
          <div className="space-y-2">
            <Label>Interactive Customization / Add-ons</Label>
            <Textarea placeholder="e.g., Contrasting Ribbon Color options or Charm selectors" value={formData.interactive_addons} onChange={(e) => setFormData({...formData, interactive_addons: e.target.value})} />
          </div>

          <div className="pt-6 border-t border-border mt-6">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-semibold">Granular Inventory (Variants)</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setVariants([...variants, { color: "", size: "", quantity: 0, sku: "" }])}>
                <Plus className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </div>
            
            {variants.length === 0 ? (
              <p className="text-sm text-muted-foreground">No specific variants created. Master stock quantity will be used.</p>
            ) : (
              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-3 border border-border/50 rounded-lg bg-background/50">
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Color</Label>
                      <Input className="h-8 text-sm" value={v.color} onChange={e => { const newV = [...variants]; newV[i].color = e.target.value; setVariants(newV); }} placeholder="e.g. Olive" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Size</Label>
                      <Input className="h-8 text-sm" value={v.size} onChange={e => { const newV = [...variants]; newV[i].size = e.target.value; setVariants(newV); }} placeholder="e.g. M" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">SKU</Label>
                      <Input className="h-8 text-sm" value={v.sku} onChange={e => { const newV = [...variants]; newV[i].sku = e.target.value; setVariants(newV); }} placeholder="e.g. BYR-OLV-M" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input className="h-8 text-sm" type="number" min="0" value={v.quantity} onChange={e => { const newV = [...variants]; newV[i].quantity = parseInt(e.target.value) || 0; setVariants(newV); }} />
                    </div>
                    <Button type="button" variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => { const newV = [...variants]; newV.splice(i, 1); setVariants(newV); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. PRODUCT COPY (SEO-OPTIMIZED)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>The Hook (1-2 highly aesthetic sentences)</Label>
            <Textarea placeholder="Redefine modern elegance with..." rows={3} value={formData.hook_text} onChange={(e) => setFormData({...formData, hook_text: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>The Deep-Dive Description</Label>
            <Textarea placeholder="Crafted for the modern fashion-forward woman..." rows={5} value={formData.deep_dive_description} onChange={(e) => setFormData({...formData, deep_dive_description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Fabric/Material & Care Guide</Label>
            <Textarea placeholder="100% Premium Cotton Lawn. Hand wash cold..." rows={4} value={formData.fabric_care} onChange={(e) => setFormData({...formData, fabric_care: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Sizing Note</Label>
            <Textarea placeholder="This set features an adjustable corset back..." rows={2} value={formData.sizing_note} onChange={(e) => setFormData({...formData, sizing_note: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-8 sticky bottom-4">
        <Button type="button" variant="outline" className="bg-background" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" size="lg" disabled={loading}>{loading ? "Saving..." : "Save Complete Product Manifest"}</Button>
      </div>
    </form>
  );
}
