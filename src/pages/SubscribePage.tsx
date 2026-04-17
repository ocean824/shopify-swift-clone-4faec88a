import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, Loader2, Tag, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [codeMessage, setCodeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, session, subscription, checkSubscription } = useAuth();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: '🎉 Welcome to The Pantheon!',
        description: 'Your subscription is now active. Enjoy unlimited access!',
      });
      void checkSubscription();
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: 'Subscription Canceled',
        description: 'You can subscribe anytime to unlock premium content.',
        variant: 'destructive',
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

  const callEdgeFunction = async <T,>(functionName: string, payload: Record<string, unknown>) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    let data: unknown = {};

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { error: responseText };
      }
    }

    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
          ? data.error
          : `Function failed with status ${response.status}`;
      throw new Error(message);
    }

    return data as T;
  };

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      const data = await callEdgeFunction<{ url?: string }>('create-subscription-checkout', {
        priceId: currentPlan.priceId,
        email: user?.email,
      });

      if (!data?.url) {
        throw new Error('No checkout URL returned');
      }

      window.location.href = data.url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) return;

    if (!user || !session?.access_token) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to redeem a code.',
        variant: 'destructive',
      });
      navigate('/auth?redirect=/subscribe');
      return;
    }

    setIsRedeeming(true);
    setCodeMessage(null);

    try {
      const data = await callEdgeFunction<{ success?: boolean; message?: string }>('redeem-lifetime-code', {
        code: redeemCode.trim(),
      });

      if (data?.success) {
        setCodeMessage({ text: data.message || 'Code redeemed successfully.', type: 'success' });
        setRedeemCode('');
        toast({
          title: '🎉 Code Redeemed!',
          description: data.message || 'Lifetime access activated.',
        });
        await checkSubscription();
      } else {
        setCodeMessage({ text: data?.message || 'Invalid code', type: 'error' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to redeem code. Please try again.';
      setCodeMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsRedeeming(false);
    }
  };

  if (subscription.subscribed) {
    return (
      <Layout>
        <BeamsBackground />
        <section className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <img
              src={pantheonHeader}
              alt="The Pantheon"
              className="mx-auto mb-6 w-full max-w-md rounded-xl"
            />
            <h1 className="sr-only">You're in The Pantheon</h1>
            <p className="text-muted-foreground mb-4 text-lg">
              {subscription.plan === 'lifetime'
                ? 'You have lifetime access — enjoy everything, forever.'
                : `Your ${subscription.plan} plan is active.`}
            </p>
            {subscription.subscriptionEnd && (
              <p className="text-sm text-muted-foreground mb-8">
                Renews: {new Date(subscription.subscriptionEnd).toLocaleDateString()}
              </p>
            )}
            <Button onClick={() => navigate('/members')} size="lg">
              Go to Members Area
            </Button>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <img
            src={pantheonHeader}
            alt="The Pantheon"
            className="mx-auto mb-6 w-full max-w-md rounded-xl"
          />
          <h1 className="sr-only">The Pantheon</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Unlock unlimited access to our exclusive library
          </p>

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
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  Save
                </span>
              )}
            </button>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
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
                <div className="mt-2 inline-flex items-center gap-1 text-primary font-medium">
                  <Sparkles className="h-4 w-4" />
                  {currentPlan.savings}
                </div>
              )}
            </div>

            <ul className="text-left space-y-4 mb-8">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{perk}</span>
                </li>
              ))}
            </ul>

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

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card/50 px-4 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Gift className="h-4 w-4" />
                <span>Have an access code?</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={redeemCode}
                  onChange={(e) => {
                    setRedeemCode(e.target.value.toUpperCase());
                    setCodeMessage(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      void handleRedeemCode();
                    }
                  }}
                  className="text-center uppercase tracking-widest font-mono"
                  maxLength={30}
                />
                <Button
                  variant="outline"
                  onClick={() => void handleRedeemCode()}
                  disabled={isRedeeming || !redeemCode.trim()}
                >
                  {isRedeeming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Tag className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {codeMessage && (
                <p
                  className={cn(
                    'text-sm font-medium',
                    codeMessage.type === 'success' ? 'text-primary' : 'text-destructive'
                  )}
                >
                  {codeMessage.text}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default SubscribePage;
