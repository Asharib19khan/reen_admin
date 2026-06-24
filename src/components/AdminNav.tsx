"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Users,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  Terminal,
  Tag,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const roleStyles: Record<string, string> = {
  super_admin: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  admin: "border-primary/40 bg-primary/10 text-primary",
};

export function AdminNav({ role, email }: { role: string; email?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["super_admin", "admin"] },
    { name: "Orders", href: "/orders", icon: ShoppingCart, roles: ["super_admin", "admin"] },
    {
      name: "Products",
      href: "/products",
      icon: Package,
      roles: ["super_admin", "admin"],
      subSections: [
        { name: "All Products", href: "/products" },
        {
          name: "Home Setup",
          href: "/products?filter=home",
          links: [
            { name: "Best Selling", href: "/products?filter=is_best_selling" },
            { name: "New Arrivals", href: "/products?filter=is_new_arrival" },
          ],
        },
        {
          name: "byreen.xo",
          href: "/products?brand=byreen_xo",
          links: [
            { name: "Rings", href: "/products?brand=byreen_xo&category=Rings" },
            { name: "Bracelets & Anklets", href: "/products?brand=byreen_xo&category=Bracelets+%26+Anklets" },
            { name: "Earrings", href: "/products?brand=byreen_xo&category=Earrings" },
            { name: "Necklaces", href: "/products?brand=byreen_xo&category=Necklaces" },
            { name: "Bangles", href: "/products?brand=byreen_xo&category=Bangles+(Churiyaan)" },
          ],
        },
        {
          name: "luxereen.wears",
          href: "/products?brand=luxereen_wears",
          links: [
            { name: "Corset Co-ords", href: "/products?brand=luxereen_wears&category=Corset+Co-ord+Sets" },
            { name: "Solid Two-Piece", href: "/products?brand=luxereen_wears&category=Solid+%26+Casual+Two-Piece+Co-ords" },
            { name: "Fusion Kurtis", href: "/products?brand=luxereen_wears&category=Fusion+%26+Printed+Kurtis" },
            { name: "Traditional Fusion", href: "/products?brand=luxereen_wears&category=Traditional+Fusion+Coordinates" },
            { name: "Western Styling", href: "/products?brand=luxereen_wears&category=Western-Fusion+Styling+%26+Skirt+Outfits" },
          ],
        },
      ],
    },
    { name: "Promos", href: "/promos", icon: Tag, roles: ["super_admin", "admin"] },
    { name: "Media", href: "/media", icon: ImageIcon, roles: ["super_admin", "admin"] },
    { name: "Reviews", href: "/reviews", icon: Star, roles: ["super_admin", "admin"] },
    { name: "Customer Wishes", href: "/customer-wishes", icon: Heart, roles: ["super_admin", "admin"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["super_admin"] },
    { name: "Team", href: "/team", icon: Users, roles: ["super_admin"] },
  ];

  const [openProducts, setOpenProducts] = useState(pathname.startsWith("/products"));
  const [openSubSection, setOpenSubSection] = useState<string | null>(null);

  const navLinkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
      active
        ? "border border-primary/30 bg-primary/10 text-primary shadow-[0_0_20px_var(--glow)]"
        : "text-muted-foreground hover:border hover:border-border/80 hover:bg-accent/50 hover:text-foreground"
    );

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border/80 bg-card/95 p-4 backdrop-blur-md">
      <div className="mb-6 flex flex-col gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
            <Terminal className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">reens</p>
            <h2 className="text-sm font-semibold tracking-tight">Admin Vault</h2>
          </div>
        </div>
        <Image src="/logo.png" alt="Reens" width={88} height={88} className="mx-auto h-12 w-auto object-contain opacity-90" priority />
        <div className="space-y-2 px-1">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
              roleStyles[role] ?? roleStyles.admin
            )}
          >
            {role.replace("_", " ")}
          </span>
          {email ? (
            <p className="truncate font-mono text-[10px] text-muted-foreground" title={email}>
              {email}
            </p>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && !item.subSections);

            if (item.subSections) {
              return (
                <div key={item.name} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setOpenProducts(!openProducts)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      pathname.startsWith("/products")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.name}
                    </div>
                    {openProducts ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  {openProducts && (
                    <div className="ml-3 mt-1 flex flex-col border-l border-border/60 pl-2">
                      {item.subSections.map((sub) => (
                        <div key={sub.name}>
                          {sub.links ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setOpenSubSection(openSubSection === sub.name ? null : sub.name)}
                                className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                              >
                                <span>{sub.name}</span>
                                {openSubSection === sub.name ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>
                              {openSubSection === sub.name && (
                                <div className="ml-2 flex flex-col border-l border-border/40 pl-2">
                                  {sub.links.map((link) => (
                                    <Link
                                      key={link.name}
                                      href={link.href}
                                      className="rounded-md px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent/40 hover:text-primary"
                                    >
                                      {link.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={sub.href}
                              className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {sub.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.name} href={item.href} className={navLinkClass(isActive)}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
      </nav>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        <ThemeToggle />
      </div>
    </aside>
  );
}
