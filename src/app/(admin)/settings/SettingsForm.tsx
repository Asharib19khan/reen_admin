"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveStorefrontSettings } from "./actions";

export function SettingsForm({ 
  initialPaymentDetails,
  initialHideByreen,
  initialHideLuxereen
}: { 
  initialPaymentDetails: string;
  initialHideByreen: boolean;
  initialHideLuxereen: boolean;
}) {
  const [details, setDetails] = useState(initialPaymentDetails);
  const [hideByreen, setHideByreen] = useState(initialHideByreen);
  const [hideLuxereen, setHideLuxereen] = useState(initialHideLuxereen);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const settingsToSave = [
      { key: "payment_details", value: details },
      { key: "hide_byreen_xo", value: hideByreen ? "true" : "false" },
      { key: "hide_luxereen_wears", value: hideLuxereen ? "true" : "false" }
    ];

    const result = await saveStorefrontSettings(settingsToSave);

    setSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-6">
        <div className="bg-card border p-6 rounded-lg space-y-6">
          <h3 className="text-lg font-medium">Storefront Visibility</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hide byreen.xo</Label>
              <p className="text-sm text-muted-foreground">
                Completely removes the byreen.xo brand from the storefront.
              </p>
            </div>
            <Switch 
              checked={hideByreen} 
              onCheckedChange={setHideByreen} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hide luxereen.wears</Label>
              <p className="text-sm text-muted-foreground">
                Completely removes the luxereen.wears brand from the storefront.
              </p>
            </div>
            <Switch 
              checked={hideLuxereen} 
              onCheckedChange={setHideLuxereen} 
            />
          </div>
        </div>

        <div className="bg-card border p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Checkout Configuration</h3>
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
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
      </Button>
    </form>
  );
}
