"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type ProductSummary = {
  id: string;
  title: string;
  price: number;
  brand: string;
  image_urls: string[] | null;
  is_active: boolean;
  quantity: number;
};

type CustomerWish = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  visitor_id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  products: ProductSummary | ProductSummary[] | null;
};

function getProduct(wish: CustomerWish): ProductSummary | null {
  if (!wish.products) return null;
  return Array.isArray(wish.products) ? wish.products[0] ?? null : wish.products;
}

export function CustomerWishesTable({
  initialWishes,
  role = "admin",
}: {
  initialWishes: CustomerWish[];
  role?: string;
}) {
  const [wishes, setWishes] = useState(initialWishes);
  const supabase = createClient();
  const canEdit = role === "super_admin" || role === "admin";

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    setWishes((prev) => prev.filter((w) => w.id !== id));
    await supabase.from("customer_wishes").delete().eq("id", id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          {canEdit && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {wishes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={canEdit ? 8 : 7} className="text-center text-muted-foreground h-24">
              No customer wishes yet.
            </TableCell>
          </TableRow>
        ) : (
          wishes.map((wish) => {
            const product = getProduct(wish);
            return (
              <TableRow key={wish.id}>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {new Date(wish.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {wish.customer_name || "—"}
                </TableCell>
                <TableCell className="text-sm">
                  <div>{wish.customer_phone || "—"}</div>
                  {wish.customer_email && (
                    <div className="text-xs text-muted-foreground">{wish.customer_email}</div>
                  )}
                </TableCell>
                <TableCell className="max-w-[220px]">
                  {product ? (
                    <Link
                      href={`/products/${product.id}`}
                      className="text-sm hover:text-primary transition-colors line-clamp-2"
                    >
                      {product.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-sm">Product removed</span>
                  )}
                </TableCell>
                <TableCell>
                  {product ? (
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {product.brand === "byreen_xo" ? "byreen.xo" : "luxereen.wears"}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{product ? `Rs. ${product.price}` : "—"}</TableCell>
                <TableCell>
                  {product ? (
                    product.quantity === 0 ? (
                      <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>
                    ) : product.is_active ? (
                      <Badge variant="default" className="text-[10px]">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Hidden</Badge>
                    )
                  ) : (
                    "—"
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(wish.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
