import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Crown, Download, Calendar, Settings, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Example exclusive content - replace with real data
const exclusiveContent = [
  { id: 1, title: 'Exclusive Beat Pack Vol. 1', type: 'Beats', downloadUrl: '#' },
  { id: 2, title: 'Members-Only Sample Kit', type: 'Samples', downloadUrl: '#' },
  { id: 3, title: 'Premium CST Collection', type: 'CST', downloadUrl: '#' },
  { id: 4, title: 'Collab Placement Pack', type: 'Collab', downloadUrl: '#' },
];

const MembersPage = () => {
  const { user, loading, subscription, signOut, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error opening customer portal:', err);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <BeamsBackground />
        <div className="relative z-10 min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Crown className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Members Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>

          {/* Subscription Status */}
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Subscription Status</h2>
                {subscription.subscribed ? (
                  <div className="space-y-1">
                    <p className="text-green-500 font-medium flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      The Pantheon - {subscription.plan === 'yearly' ? 'Yearly' : 'Monthly'}
                    </p>
                    {subscription.subscriptionEnd && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Renews on {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No active subscription</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={checkSubscription}>
                  Refresh Status
                </Button>
                {subscription.subscribed && (
                  <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          {subscription.subscribed ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Exclusive Content</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {exclusiveContent.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-primary font-medium uppercase tracking-wider">
                          {item.type}
                        </span>
                        <h3 className="font-semibold mt-1">{item.title}</h3>
                      </div>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Unlock Exclusive Content</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to The Pantheon to access exclusive beats, samples, and more.
              </p>
              <Button onClick={() => navigate('/subscribe')} size="lg">
                <Crown className="h-5 w-5 mr-2" />
                Join The Pantheon
              </Button>
            </div>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default MembersPage;
