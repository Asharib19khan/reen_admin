import { createClient } from "@/utils/supabase/server";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { ProductsTable } from "./ProductsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ brand?: string; category?: string; filter?: string }>
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const { brand, filter } = resolvedParams;
  const category = resolvedParams.category
    ? decodeURIComponent(resolvedParams.category)
    : undefined;

  const { data: { session } } = await supabase.auth.getSession();
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("id", session?.user.id).single();
  const role = session?.user.email?.toLowerCase() === 'yeezus196@gmail.com' ? 'super_admin' : (userRole?.role || "employee");

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (brand) {
    query = query.eq("brand", brand);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (filter === "is_best_selling") {
    query = query.eq("is_best_selling", true);
  } else if (filter === "is_new_arrival") {
    query = query.eq("is_new_arrival", true);
  } else if (filter === "home") {
    query = query.or("is_best_selling.eq.true,is_new_arrival.eq.true");
  }

  const { data: products } = await query;

  let pageTitle = "All Products";
  if (filter === "is_best_selling") {
    pageTitle = "Best Selling";
  } else if (filter === "is_new_arrival") {
    pageTitle = "New Arrivals";
  } else if (filter === "home") {
    pageTitle = "Home Page Featured";
  } else if (brand && category) {
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
      <AdminPageHeader
        title={pageTitle}
        description="Manage storefront inventory and product details."
        actions={
          <Link href={addProductHref}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        }
      />
      <div className="admin-panel overflow-hidden">
        <ProductsTable initialProducts={products || []} role={role} />
      </div>
    </div>
  );
}
