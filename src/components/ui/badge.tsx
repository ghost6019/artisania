import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-tight",
  {
    variants: {
      variant: {
        default: "bg-ink text-white",
        secondary: "bg-surface-muted text-ink-soft",
        success: "bg-accent-soft text-accent-ink",
        warning: "bg-amber-50 text-amber-900",
        danger: "bg-red-50 text-red-800",
        outline: "border border-line text-steel",
        demo: "border border-amber-200 bg-amber-100 text-amber-950",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
