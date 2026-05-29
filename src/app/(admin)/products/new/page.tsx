import { ProductForm } from "../ProductForm";
import { createClient } from "@/utils/supabase/server";
import { AdminPageHeader } from "@/components/AdminPageHeader";

export default async function NewProductPage({
  searchParams
}: {
  searchParams: Promise<{ brand?: string, category?: string }>
}) {
  await createClient();
  // Employees ARE allowed to add products, so no redirect here.
  
  const resolvedParams = await searchParams;
  const category = resolvedParams.category
    ? decodeURIComponent(resolvedParams.category)
    : "Rings";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <AdminPageHeader title="Add Product" description="Create a new catalog item for the storefront." />
      <ProductForm initialData={{
        brand: resolvedParams.brand || "byreen_xo",
        category,
      }} />
    </div>
  );
}
