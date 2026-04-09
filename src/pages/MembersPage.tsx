import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Crown, Download, Calendar, Settings, Loader2, Lock, Package, RefreshCw, Shield } from 'lucide-react';
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

interface PantheonContent {
  id: string;
  title: string;
  type: string;
  description: string | null;
  file_path: string;
  external_url: string | null;
}

// Members-only kits configuration - add each kit you upload to Shopify here
interface MembersKit {
  id: string;
  shopifyProductTitle: string;
  displayTitle: string;
  discountCode: string;
  description: string;
  externalLink?: string;
  downloadPath?: string;
}

const MEMBERS_ONLY_KITS: MembersKit[] = [
  {
    id: 'pantheon-members-kit-1',
    shopifyProductTitle: 'Pantheon Members Only Kits',
    displayTitle: 'Pantheon Members Only Kits',
    discountCode: 'PANTHEONKITS100',
    description: 'Exclusive samples for Pantheon members',
    externalLink: 'https://www.dropbox.com/scl/fo/py6d08xszo6cll8j7seor/AJyrUzBKfpy-LASo2ua4R_Y?rlkey=xvvkyux7mn0rnxcyi8plyhl1p&st=6rz6sx8f&dl=0',
  },
  {
    id: 'music-industry-resource-bundle',
    shopifyProductTitle: 'Music Industry Resource Bundle',
    displayTitle: 'Music Industry Resource Bundle',
    discountCode: '',
    description: 'Essential resources for navigating the music industry',
    downloadPath: '/downloads/SAMPLE_SOCIETY_MUSIC_INDUSTRY_RESOURCES_BUNDLE.zip',
  },
];

const MembersPage = () => {
  const { user, loading, subscription, signOut, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [pantheonContent, setPantheonContent] = useState<PantheonContent[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [downloadingKitId, setDownloadingKitId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPurchases();
      checkAdminStatus();
      if (subscription.subscribed) {
        fetchPantheonContent();
      }
    }
  }, [user, subscription.subscribed]);

  const checkAdminStatus = async () => {
    if (!user?.email) return;
    try {
      const { data } = await supabase
        .from('admin_accounts')
        .select('email')
        .eq('email', user.email)
        .maybeSingle();
      setIsAdmin(!!data);
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

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

  const fetchPantheonContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase
        .from('pantheon_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPantheonContent(data || []);
    } catch (err) {
      console.error('Error fetching pantheon content:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleDownloadContent = async (content: PantheonContent) => {
    // If external URL exists, open it directly
    if (content.external_url) {
      window.open(content.external_url, '_blank');
      return;
    }
    
    // Otherwise get signed URL from storage
    try {
      const { data, error } = await supabase.storage
        .from('pantheon-content')
        .createSignedUrl(content.file_path, 3600); // 1 hour expiry
      
      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      console.error('Error getting download URL:', err);
      toast({
        title: "Error",
        description: "Failed to get download link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRedownload = async (purchase: Purchase) => {
    // Direct WeTransfer link for All Kits Bundle
    if (purchase.productName.toLowerCase().includes('all kits bundle') || 
        purchase.productName.toLowerCase().includes('all-kits-bundle')) {
      window.open('https://we.tl/t-dvPWLOJdRp', '_blank');
      return;
    }

    setResendingId(purchase.id);
    try {
      const { data, error } = await supabase.functions.invoke('resend-download', {
        body: { purchaseId: purchase.id, productName: purchase.productName },
      });
      
      if (error) throw error;
      
      if (data?.checkoutUrl) {
        toast({
          title: "Redownload Ready!",
          description: "Complete the free checkout to receive your download email.",
        });
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (err) {
      console.error('Error creating redownload:', err);
      toast({
        title: "Error",
        description: "Failed to create redownload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleMembersKitDownload = async (kit: MembersKit) => {
    // If external link, open directly
    if (kit.externalLink) {
      window.open(kit.externalLink, '_blank');
      return;
    }
    // If local download path, trigger download
    if (kit.downloadPath) {
      const link = document.createElement('a');
      link.href = kit.downloadPath;
      link.download = kit.downloadPath.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    // Fallback: Shopify checkout flow
    setDownloadingKitId(kit.id);
    try {
      const { data, error } = await supabase.functions.invoke('resend-download', {
        body: { 
          purchaseId: kit.id, 
          productName: kit.shopifyProductTitle,
          discountCode: kit.discountCode
        },
      });
      
      if (error) throw error;
      
      if (data?.checkoutUrl) {
        toast({
          title: "Download Ready!",
          description: "Complete the free checkout to receive your download email.",
        });
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (err) {
      console.error('Error creating download:', err);
      toast({
        title: "Error",
        description: "Failed to create download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingKitId(null);
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
                      The Pantheon - {subscription.plan === 'lifetime' ? 'Lifetime VIP' : subscription.plan === 'yearly' ? 'Yearly' : 'Monthly'}
                    </p>
                    {subscription.isVip && (
                      <p className="text-sm text-primary font-medium">★ VIP Account - All Access</p>
                    )}
                    {subscription.subscriptionEnd && !subscription.isVip && (
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
                        onClick={() => handleRedownload(purchase)}
                        disabled={resendingId === purchase.id}
                      >
                        {resendingId === purchase.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Redownload
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
              <div className="space-y-4">
                {/* Members Only Sample Kits */}
                {MEMBERS_ONLY_KITS.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs text-primary font-medium uppercase tracking-wider">
                      Samples
                    </h3>
                    {MEMBERS_ONLY_KITS.map((kit, index) => (
                      <motion.div
                        key={kit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-primary/30 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold truncate">{kit.displayTitle}</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">{kit.description}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => handleMembersKitDownload(kit)}
                            disabled={downloadingKitId === kit.id}
                            className="flex-shrink-0"
                          >
                            {downloadingKitId === kit.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Download className="h-4 w-4 mr-2" />
                            )}
                            Download
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Coming Soon items */}
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { type: 'VST', title: 'Members Only VSTs' },
                    { type: 'Discord', title: 'Private Discord Access' },
                    { type: 'Courses', title: 'Secret Sauce Courses' },
                    { type: 'NFT', title: 'Members Only NFTs' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-border/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {item.type}
                          </span>
                          <h3 className="font-semibold mt-1 text-muted-foreground">{item.title}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
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

          {/* Admin Section - Only visible to admins */}
          {isAdmin && (
            <div className="mt-8">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-primary/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <div>
                      <h2 className="text-xl font-semibold">Admin Panel</h2>
                      <p className="text-sm text-muted-foreground">Manage discount codes and access</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/admin/codes')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Codes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default MembersPage;
