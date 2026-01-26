import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Crown, Download, Calendar, Settings, Loader2, Lock, Mail, Package, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Purchase {
  id: string;
  productName: string;
  amount: number;
  currency: string;
  purchaseDate: string;
  email: string;
}

// Pantheon exclusive content
const pantheonContent = [
  { id: 1, title: 'Exclusive Beat Pack Vol. 1', type: 'Beats', downloadUrl: '#' },
  { id: 2, title: 'Members-Only Sample Kit', type: 'Samples', downloadUrl: '#' },
  { id: 3, title: 'Premium CST Collection', type: 'CST', downloadUrl: '#' },
  { id: 4, title: 'Collab Placement Pack', type: 'Collab', downloadUrl: '#' },
  { id: 5, title: 'VST Essentials Bundle', type: 'VST', downloadUrl: '#' },
  { id: 6, title: 'Bi-Weekly Drop: January', type: 'New', downloadUrl: '#' },
];

const MembersPage = () => {
  const { user, loading, subscription, signOut, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-purchases');
      
      if (error) throw error;
      
      setPurchases(data?.purchases || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const handleResendDownload = async (purchase: Purchase) => {
    setResendingId(purchase.id);
    try {
      const { data, error } = await supabase.functions.invoke('resend-download', {
        body: { purchaseId: purchase.id, productName: purchase.productName },
      });
      
      if (error) throw error;
      
      toast({
        title: "Download Link Sent!",
        description: `Check ${purchase.email} for your download link.`,
      });
    } catch (err) {
      console.error('Error resending download:', err);
      toast({
        title: "Error",
        description: "Failed to resend download link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendingId(null);
    }
  };

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
                <h1 className="text-3xl font-bold">My Account</h1>
                <p className="text-muted-foreground">{user.email}</p>
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
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                {subscription.subscribed ? (
                  <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => navigate('/subscribe')}>
                    <Crown className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Purchases Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                My Purchases
              </h2>
              <Button variant="ghost" size="sm" onClick={fetchPurchases} disabled={loadingPurchases}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingPurchases ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {loadingPurchases ? (
              <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Loading purchases...</p>
              </div>
            ) : purchases.length > 0 ? (
              <div className="grid gap-4">
                {purchases.map((purchase) => (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{purchase.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Purchased {new Date(purchase.purchaseDate).toLocaleDateString()} • ${purchase.amount} {purchase.currency}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleResendDownload(purchase)}
                        disabled={resendingId === purchase.id}
                      >
                        {resendingId === purchase.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Mail className="h-4 w-4 mr-2" />
                        )}
                        Resend Download
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No purchases yet</p>
                <Button variant="link" onClick={() => navigate('/sample-kits')}>
                  Browse Sample Kits
                </Button>
              </div>
            )}
          </div>

          {/* Pantheon Content Section */}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-primary" />
              Pantheon Exclusive Content
            </h2>
            
            {subscription.subscribed ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pantheonContent.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-primary/30 hover:border-primary transition-colors"
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
            ) : (
              <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border text-center">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Unlock Exclusive Content</h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to The Pantheon to access exclusive beats, samples, CSTs, VSTs, and more.
                </p>
                <Button onClick={() => navigate('/subscribe')}>
                  <Crown className="h-5 w-5 mr-2" />
                  Join The Pantheon
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default MembersPage;
