interface PromoMarqueeProps {
  message?: string;
}

export function PromoMarquee({ 
  message = "🔥 ALL KITS BUNDLE 2025 NOW AVAILABLE • FREE INSTANT DOWNLOAD • MASTER USE • 100% ORIGINAL SOUNDS • " 
}: PromoMarqueeProps) {
  const messages = Array(8).fill(message).join('');

  return (
    <div className="relative overflow-hidden bg-primary py-2.5">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-foreground">
          {messages}
        </span>
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-foreground">
          {messages}
        </span>
      </div>
    </div>
  );
}