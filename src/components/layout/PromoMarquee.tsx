interface PromoMarqueeProps {
  message?: string;
}

export function PromoMarquee({ 
  message = "🔥 BUILD A BUNDLE & SAVE UP TO 40% • FREE INSTANT DOWNLOAD • ROYALTY FREE • 100% ORIGINAL SOUNDS • " 
}: PromoMarqueeProps) {
  // Create enough repetitions for seamless loop
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