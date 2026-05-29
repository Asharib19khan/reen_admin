"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function SettingsForm({ initialPaymentDetails }: { initialPaymentDetails: string }) {
  const [details, setDetails] = useState(initialPaymentDetails);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const { error: saveError } = await supabase.from("settings").upsert(
      { key: "payment_details", value: details },
      { onConflict: "key" }
    );

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="payment_details">Payment Details / Instructions</Label>
          <p className="text-sm text-muted-foreground mb-4 mt-2">
            This text will be displayed to customers on the checkout screen.
          </p>
          <Textarea
            id="payment_details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={10}
            placeholder="e.g. Please transfer to EasyPaisa account 0300-1234567..."
            className="font-mono text-sm bg-card"
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
      </Button>
    </form>
  );
}
