import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BundleCTA() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl lg:text-5xl">
            Build Your Bundle
          </h2>
          
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Pick 3 products and get <span className="font-bold text-primary">25% OFF</span>, 
            or pick 5 and save <span className="font-bold text-primary">40%</span> on your entire order.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 glow-primary">
              <Link to="/bundle">
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Bundle tiers */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:gap-6">
            <div className="rounded-lg border border-border bg-background/50 p-6">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Pick 3
              </span>
              <p className="mt-2 text-3xl font-bold text-foreground">25% OFF</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Any 3 products in your bundle
              </p>
            </div>
            <div className="rounded-lg border border-primary bg-primary/10 p-6">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Pick 5 — Best Value
              </span>
              <p className="mt-2 text-3xl font-bold text-foreground">40% OFF</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Any 5 products in your bundle
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}