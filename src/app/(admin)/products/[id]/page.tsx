import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { ProductForm } from "../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("id", session?.user.id).single();
  const role = session?.user.email?.toLowerCase() === 'yeezus196@gmail.com' ? 'super_admin' : userRole?.role;
  if (role === "employee") redirect("/products");

  const { data: product } = await supabase.from("products").select("*").eq("id", resolvedParams.id).single();

  if (!product) notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <AdminPageHeader title="Edit Product" description={product.title} badge={product.brand} />
      <ProductForm initialData={product} />
    </div>
  );
}
