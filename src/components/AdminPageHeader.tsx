import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, description, badge, actions }: AdminPageHeaderProps) {
  return (
    <header className="mb-8 space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary/90">
          ~/vault{badge ? ` · ${badge}` : ""}
        </p>
        <span className="hidden h-px flex-1 bg-border/80 sm:block" aria-hidden />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="admin-page-title">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
