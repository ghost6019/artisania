import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  compact?: boolean;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
};

/** Marque vectorielle Artisania — A atelier + accent teal */
export function LogoMark({
  className,
  inverted = false,
  size = "md",
}: {
  className?: string;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-12 w-12" : "h-8 w-8";
  const ink = inverted ? "#F4F7FA" : "#071525";
  const accent = "#0F766E";

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-[0.55rem]",
        inverted ? "bg-white/10 ring-1 ring-white/15" : "bg-ink ring-1 ring-ink/10",
        dim,
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 40"
        className="h-[72%] w-[72%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* A structure */}
        <path
          d="M20 6.5 31.5 32H26.2L23.4 25.2H16.6L13.8 32H8.5L20 6.5Z"
          fill={inverted ? ink : "#F4F7FA"}
        />
        {/* Crossbar teal */}
        <path d="M15.35 21.1h9.3v2.35h-9.3V21.1Z" fill={accent} />
        {/* Inner cut for crisp A counter */}
        <path
          d="M20 12.2 23.05 19.4h-6.1L20 12.2Z"
          fill={inverted ? "#0B1A2B" : "#071525"}
        />
      </svg>
    </span>
  );
}

export function Logo({
  href = "/",
  className,
  compact = false,
  inverted = false,
  size = "md",
}: LogoProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Artisania";
  const textSize =
    size === "lg" ? "text-xl" : size === "sm" ? "text-[0.95rem]" : "text-[1.05rem]";

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark inverted={inverted} size={size} />
      {!compact ? (
        <span
          className={cn(
            "font-display font-semibold tracking-[-0.04em]",
            textSize,
            inverted ? "text-white" : "text-ink",
          )}
        >
          {appName}
          <span className="text-accent">.</span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="group focus-visible:outline-none" aria-label={appName}>
      {content}
    </Link>
  );
}
