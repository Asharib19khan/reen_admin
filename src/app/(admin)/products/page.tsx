import { createClient } from "@/utils/supabase/server";
import { ProductsTable } from "./ProductsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ brand?: string, category?: string }>
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const { brand, category } = resolvedParams;
  
  const { data: { session } } = await supabase.auth.getSession();
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("id", session?.user.id).single();
  const role = session?.user.email?.toLowerCase() === 'yeezus196@gmail.com' ? 'super_admin' : (userRole?.role || "employee");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  let pageTitle = "All Products";
  if (brand && category) {
    const displayBrand = brand === 'byreen_xo' ? 'byreen.xo' : 'luxereen.wears';
    pageTitle = `${displayBrand} — ${category}`;
  } else if (brand) {
    const displayBrand = brand === 'byreen_xo' ? 'byreen.xo' : 'luxereen.wears';
    pageTitle = `${displayBrand} Products`;
  } else if (category) {
    pageTitle = `${category} Products`;
  }

  const addProductHref = `/products/new${(brand || category) ? `?${new URLSearchParams(resolvedParams as Record<string, string>).toString()}` : ''}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your storefront inventory and product details.</p>
        </div>
        <Link href={addProductHref}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>
      <div className="bg-card border border-border">
        <ProductsTable initialProducts={products || []} role={role} />
      </div>
    </div>
  );
}
