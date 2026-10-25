import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,background-color,border-color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] hover:bg-ink-soft",
        accent:
          "bg-accent text-white hover:bg-accent-ink shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
        secondary:
          "bg-surface text-ink border border-line hover:border-ink/20 hover:bg-surface-muted/60",
        outline:
          "border border-line bg-transparent text-ink hover:border-ink/25 hover:bg-surface",
        ghost: "text-ink hover:bg-surface-muted/80",
        danger: "bg-red-700 text-white hover:bg-red-800",
        link: "text-accent-ink underline-offset-4 hover:underline",
        soft: "bg-accent-soft text-accent-ink hover:bg-teal-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-[0.95rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
