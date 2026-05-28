"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, Users, Image as ImageIcon, ChevronDown, ChevronRight, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export function AdminNav({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["super_admin", "admin", "employee"] },
    { name: "Orders", href: "/orders", icon: ShoppingCart, roles: ["super_admin", "admin", "employee"] },
    { 
      name: "Products", href: "/products", icon: Package, roles: ["super_admin", "admin", "employee"],
      subSections: [
        { name: "All Products", href: "/products" },
        { 
          name: "Home Setup", 
          href: "/products?filter=home",
          links: [
            { name: "Best Selling", href: "/products?filter=is_best_selling" },
            { name: "New Arrivals", href: "/products?filter=is_new_arrival" }
          ]
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
          ]
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
          ]
        }
      ]
    },
    { name: "Media", href: "/media", icon: ImageIcon, roles: ["super_admin", "admin"] },
    { name: "Reviews", href: "/reviews", icon: Star, roles: ["super_admin", "admin"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["super_admin"] },
    { name: "Team", href: "/team", icon: Users, roles: ["super_admin"] },
  ];

  const [openProducts, setOpenProducts] = useState(pathname.startsWith("/products"));
  const [openSubSection, setOpenSubSection] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-64 border-r border-border bg-card min-h-screen p-4 sticky top-0 h-screen">
      <div className="mb-8 px-2 flex flex-col items-center border-b border-border pb-6">
        <Image src="/logo.png" alt="Reens Logo" width={100} height={100} className="h-16 w-auto object-contain mb-4" priority />
        <h2 className="text-xl font-bold tracking-tighter">ADMIN VAULT</h2>
        <div className="mt-1 text-xs text-muted-foreground uppercase font-mono tracking-wider">Role: {role}</div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.filter(item => item.roles.includes(role)).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && !item.subSections);
          
          if (item.subSections) {
            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => setOpenProducts(!openProducts)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-colors rounded-none",
                    pathname.startsWith("/products") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                  {openProducts ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                
                {openProducts && (
                  <div className="flex flex-col ml-4 border-l border-border mt-1">
                    {item.subSections.map(sub => (
                      <div key={sub.name}>
                        {sub.links ? (
                          <>
                            <button
                              onClick={() => setOpenSubSection(openSubSection === sub.name ? null : sub.name)}
                              className="flex items-center justify-between w-full px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                              <span>{sub.name}</span>
                              {openSubSection === sub.name ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </button>
                            {openSubSection === sub.name && (
                              <div className="flex flex-col ml-2 border-l border-border mb-1">
                                {sub.links.map(link => (
                                  <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
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
                            className="flex items-center w-full px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
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
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-none",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
