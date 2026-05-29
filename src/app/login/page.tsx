import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseConfigError, isSupabaseConfigured } from "@/utils/supabase/env";
import { Terminal } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configError = getSupabaseConfigError();

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="admin-panel w-full max-w-md space-y-4 p-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-destructive">config_error</p>
          <h1 className="text-xl font-semibold">Configuration required</h1>
          <p className="text-sm text-muted-foreground">{configError}</p>
          <p className="font-mono text-xs text-muted-foreground">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="admin-panel overflow-hidden">
          <div className="border-b border-border/60 bg-accent/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                <Terminal className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">~/reens/vault</p>
                <h1 className="text-lg font-semibold tracking-tight">Authenticate</h1>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="flex justify-center">
              <Image src="/logo.png" alt="Reens" width={72} height={72} className="h-14 w-auto opacity-90" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Sign in to the internal operations console.
            </p>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="admin-mono-label">
                  Email
                </Label>
                <Input id="email" name="email" type="email" required placeholder="you@company.com" className="font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="admin-mono-label">
                  Password
                </Label>
                <Input id="password" name="password" type="password" required className="font-mono text-sm" />
              </div>
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
                  {error}
                </div>
              )}
              <Button type="submit" formAction={login} className="h-10 w-full font-medium">
                Enter vault
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground/70">
          Authorized personnel only · sessions are audited
        </p>
      </div>
    </div>
  );
}
