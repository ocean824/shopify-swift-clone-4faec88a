import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const perks = [
  'Unlimited access to exclusive beat packs',
  'Members-only sample kits',
  "CST's & VST's included",
  'Open collab placement pack opportunities',
  'New product drops bi-weekly',
  'Full library of releases and bonuses',
];

const SubscribePage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricing = {
    monthly: {
      price: 50,
      period: 'month',
      savings: null,
    },
    yearly: {
      price: 500,
      period: 'year',
      savings: '~17% off',
    },
  };

  const currentPlan = pricing[billingCycle];

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Crown className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
            The Pantheon
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Unlock unlimited access to our exclusive library
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-6 py-2 rounded-full font-medium transition-all',
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'px-6 py-2 rounded-full font-medium transition-all relative',
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              Yearly
              {billingCycle !== 'yearly' && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Save
                </span>
              )}
            </button>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
            {/* Pricing */}
            <div className="mb-8">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl md:text-6xl font-bold text-foreground">
                  ${currentPlan.price}
                </span>
                <span className="text-muted-foreground text-lg">
                  /{currentPlan.period}
                </span>
              </div>
              {currentPlan.savings && (
                <div className="mt-2 inline-flex items-center gap-1 text-green-500 font-medium">
                  <Sparkles className="h-4 w-4" />
                  {currentPlan.savings}
                </div>
              )}
            </div>

            {/* Perks List */}
            <ul className="text-left space-y-4 mb-8">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{perk}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button asChild size="lg" className="w-full text-lg py-6">
              <a 
                href="https://www.sample-society.com/signup" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Join The Pantheon
              </a>
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default SubscribePage;
