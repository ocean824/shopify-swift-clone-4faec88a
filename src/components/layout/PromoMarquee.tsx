import { motion } from 'framer-motion';

interface PromoMarqueeProps {
  message?: string;
}

export function PromoMarquee({ 
  message = "🎉 LAUNCH SALE • UP TO 50% OFF • FREE SHIPPING ON ORDERS $50+ • 🎉" 
}: PromoMarqueeProps) {
  // Duplicate the message for seamless loop
  const repeatedMessage = `${message} ${message} ${message} ${message}`;

  return (
    <div className="relative overflow-hidden bg-primary py-2">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -50 + '%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
      >
        <span className="inline-block px-4 text-sm font-medium text-primary-foreground">
          {repeatedMessage}
        </span>
        <span className="inline-block px-4 text-sm font-medium text-primary-foreground">
          {repeatedMessage}
        </span>
      </motion.div>
    </div>
  );
}
