import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      {/* Header fixed — réserve l'espace sauf sur les pages à hero full-bleed */}
      <div className="flex-1 pt-14 sm:pt-[4.5rem] [&:has([data-fullbleed-hero])]:pt-0">
        {children}
      </div>
      <PublicFooter />
    </div>
  );
}
