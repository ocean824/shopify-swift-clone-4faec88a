import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Hero Image Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&h=1080&fit=crop"
          alt="Music production studio"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="inline-block rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              🔥 New Releases Available
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            PREMIUM SOUNDS
            <br />
            <span className="text-primary text-glow">FOR PRODUCERS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto"
          >
            Industry-ready sample packs, MIDI kits, and drum sounds. 
            Build your bundle and save up to 40% on your order.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="gap-2 glow-primary">
              <Link to="/bundle">
                Build Your Bundle
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/products">
                Browse All Products
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative border-t border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '10K+', label: 'Producers' },
              { value: '500+', label: 'Sounds' },
              { value: '100%', label: 'Royalty Free' },
              { value: '40%', label: 'Bundle Savings' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}