"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function PromosPage() {
  const supabase = createClient();
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    min_order_value: 0,
    max_uses: "",
    is_active: true
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (data) setPromos(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      min_order_value: Number(formData.min_order_value),
      max_uses: formData.max_uses ? Number(formData.max_uses) : null,
      is_active: formData.is_active
    };

    const { error } = await supabase.from("promo_codes").insert([payload]);
    if (error) {
      alert("Error creating promo: " + error.message);
    } else {
      setOpen(false);
      setFormData({ code: "", discount_type: "percentage", discount_value: 0, min_order_value: 0, max_uses: "", is_active: true });
      fetchPromos();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("promo_codes").update({ is_active: !current }).eq("id", id);
    fetchPromos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    fetchPromos();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <AdminPageHeader title="Promo Codes" description="Manage discounts and promotional campaigns." />
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Create Promo</Button>
      </div>

      <div className="rounded-md border border-border/50 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading promos...</TableCell></TableRow>
            ) : promos.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No promo codes found.</TableCell></TableRow>
            ) : (
              promos.map(promo => (
                <TableRow key={promo.id}>
                  <TableCell className="font-mono font-medium">{promo.code}</TableCell>
                  <TableCell>
                    {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `Rs. ${promo.discount_value} OFF`}
                  </TableCell>
                  <TableCell>Rs. {promo.min_order_value}</TableCell>
                  <TableCell>
                    {promo.current_uses} {promo.max_uses ? `/ ${promo.max_uses}` : '(Unlimited)'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={promo.is_active ? "default" : "secondary"}>
                      {promo.is_active ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => toggleActive(promo.id, promo.is_active)}>
                      {promo.is_active ? "Disable" : "Enable"}
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(promo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-border">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Create Promo Code</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Code (e.g. EID20)</Label>
                <Input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select 
                    className="flex h-9 w-full border border-input bg-background px-3 py-1 text-sm shadow-sm rounded-md"
                    value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input type="number" required min="1" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Order Value (Rs.)</Label>
                  <Input type="number" min="0" value={formData.min_order_value} onChange={e => setFormData({...formData, min_order_value: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses (Optional)</Label>
                  <Input type="number" min="1" placeholder="Unlimited if blank" value={formData.max_uses} onChange={e => setFormData({...formData, max_uses: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch checked={formData.is_active} onCheckedChange={c => setFormData({...formData, is_active: c})} />
                <Label>Active immediately</Label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Create Promo</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
