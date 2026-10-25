const TRADES = [
  "Électricien",
  "Plombier",
  "Menuisier",
  "Peintre",
  "Chauffagiste",
  "Carreleur",
  "Couvreur",
  "Serrurier",
  "Maçon",
  "Paysagiste",
  "Plâtrier",
  "Vitrier",
];

export function TradesMarquee() {
  const row = [...TRADES, ...TRADES];

  return (
    <div className="relative overflow-hidden border-y border-line bg-surface py-3 sm:py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-surface to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-surface to-transparent sm:w-16" />
      <div className="flex w-max animate-marquee gap-6 whitespace-nowrap pr-6 sm:gap-10 sm:pr-10">
        {row.map((trade, i) => (
          <span
            key={`${trade}-${i}`}
            className="font-display text-xs font-semibold tracking-tight text-ink/55 sm:text-sm"
          >
            {trade}
            <span className="ml-6 text-accent/40 sm:ml-10">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
