import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line bg-surface/70 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-ink text-white">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-steel">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
