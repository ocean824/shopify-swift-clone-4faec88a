import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "🎉 Welcome to The Pantheon!",
        description: "Your subscription is now active. Enjoy unlimited access!",
      });
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Subscription Canceled",
        description: "You can subscribe anytime to unlock premium content.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const pricing = {
    monthly: {
      price: 50,
      period: 'month',
      savings: null,
      priceId: 'monthly',
    },
    yearly: {
      price: 500,
      period: 'year',
      savings: '~17% off',
      priceId: 'yearly',
    },
  };

  const currentPlan = pricing[billingCycle];

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { priceId: currentPlan.priceId },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <Button 
              size="lg" 
              className="w-full text-lg py-6"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                'Join The Pantheon'
              )}
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
