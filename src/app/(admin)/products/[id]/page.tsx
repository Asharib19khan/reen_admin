import { createClient } from "@/utils/supabase/server";
import { getAdminRole } from "@/lib/admin-role";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { ProductForm } from "../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const auth = await getAdminRole();
  const role = auth?.role || "admin";

  const { data: product } = await supabase.from("products").select("*, product_variants(*)").eq("id", resolvedParams.id).single();

  if (!product) notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <AdminPageHeader title="Edit Product" description={product.title} badge={product.brand} />
      <ProductForm initialData={product} />
    </div>
  );
}
