import { ProductForm } from "../ProductForm";
import { createClient } from "@/utils/supabase/server";

export default async function NewProductPage({
  searchParams
}: {
  searchParams: Promise<{ brand?: string, category?: string }>
}) {
  await createClient();
  // Employees ARE allowed to add products, so no redirect here.
  
  const resolvedParams = await searchParams;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>
      <ProductForm initialData={{
        brand: resolvedParams.brand || "byreen_xo",
        category: resolvedParams.category || "Rings"
      }} />
    </div>
  );
}
