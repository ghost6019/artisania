import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PriorityItem = {
  id: string;
  label: string;
  detail: string;
  href: string;
  urgency: "high" | "medium" | "low";
};

export function PriorityStrip({ items }: { items: PriorityItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-[var(--radius-lg)] border border-ink/10 bg-ink text-white shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300/80">
            Focus
          </p>
          <p className="font-display text-base font-semibold sm:text-lg">
            {items.length} priorité{items.length > 1 ? "s" : ""} maintenant
          </p>
        </div>
      </div>
      <ul className="divide-y divide-white/10">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors active:bg-white/5 sm:gap-4 sm:px-5 sm:py-4 sm:hover:bg-white/5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    item.urgency === "high" && "bg-amber-400",
                    item.urgency === "medium" && "bg-teal-300",
                    item.urgency === "low" && "bg-white/35",
                  )}
                />
                <div className="min-w-0">
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="mt-0.5 text-sm text-white/50">{item.detail}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-200" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
