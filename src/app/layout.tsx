import type { Metadata, Viewport } from "next";
import { Figtree, Syne } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Artisania";

export const metadata: Metadata = {
  title: {
    default: `${appName} — L'atelier numérique des artisans`,
    template: `%s · ${appName}`,
  },
  description:
    "Artisania orchestre clients, agenda, interventions, devis et factures — et met les artisans en relation avec les particuliers. Conçu pour les métiers manuels en France.",
  appleWebApp: {
    capable: true,
    title: appName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#071525" },
    { media: "(prefers-color-scheme: dark)", color: "#071525" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${figtree.variable} ${syne.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
