"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

type Product = {
  id: string;
  is_active: boolean;
  title: string;
  brand: string;
  price: number;
  quantity: number;
  category?: string;
  image_urls?: string[];
};

export function ProductsTable({ initialProducts, role = "admin" }: { initialProducts: Product[], role?: string }) {
  const [products, setProducts] = useState(initialProducts);
  const supabase = createClient();
  
  const canEdit = role === "super_admin" || role === "admin";

  const toggleActive = async (id: string, current: boolean) => {
    setProducts(products.map(p => p.id === id ? { ...p, is_active: !current } : p));
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setProducts(products.filter(p => p.id !== id));
    await supabase.from("products").delete().eq("id", id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
              No products found.
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/60 backdrop-blur-xl shadow-sm">
                  {product.image_urls?.[0] ? (
                    <div className="relative w-full h-full">
                      <Image src={product.image_urls[0]} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>
                <span className="text-xs bg-muted px-2 py-1 border border-border">{product.brand === 'byreen_xo' ? 'byreen.xo' : 'luxereen.wears'}</span>
              </TableCell>
              <TableCell>Rs. {product.price}</TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <span>{product.quantity}</span>
                  {product.quantity <= 5 && (
                    <Badge variant="destructive" className="text-[10px] h-5 px-1 py-0 uppercase tracking-wider">
                      Low Stock
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={product.is_active}
                  onCheckedChange={() => toggleActive(product.id, product.is_active)}
                  disabled={!canEdit}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {canEdit ? (
                    <>
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">View Only</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
