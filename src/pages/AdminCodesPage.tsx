import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Shield, Plus, Trash2, Loader2, Copy, Users, Ban, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  grants_pantheon_lifetime: boolean;
  applies_to: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

interface CodeRedemption {
  id: string;
  code_id: string;
  user_email: string;
  redeemed_at: string;
  purchase_verified: boolean;
  is_revoked: boolean;
  revoked_reason: string | null;
}

const AdminCodesPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [redemptions, setRedemptions] = useState<CodeRedemption[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);
  
  // Form state
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDiscountType, setFormDiscountType] = useState('percentage');
  const [formDiscountValue, setFormDiscountValue] = useState('0');
  const [formMaxUses, setFormMaxUses] = useState('');
  const [formGrantsPantheon, setFormGrantsPantheon] = useState(false);
  const [formAppliesTo, setFormAppliesTo] = useState('all');
  const [formValidUntil, setFormValidUntil] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_accounts')
        .select('email')
        .eq('email', user?.email)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setIsAdmin(true);
        fetchCodes();
        fetchRedemptions();
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchCodes = async () => {
    setLoadingCodes(true);
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCodes(data || []);
    } catch (err) {
      console.error('Error fetching codes:', err);
    } finally {
      setLoadingCodes(false);
    }
  };

  const fetchRedemptions = async () => {
    try {
      const { data, error } = await supabase
        .from('code_redemptions')
        .select('*')
        .order('redeemed_at', { ascending: false });
      
      if (error) throw error;
      setRedemptions(data || []);
    } catch (err) {
      console.error('Error fetching redemptions:', err);
    }
  };

  const handleCreateCode = async () => {
    if (!formCode.trim()) {
      toast({ title: "Error", description: "Code is required", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('discount_codes')
        .insert({
          code: formCode.toUpperCase().trim(),
          description: formDescription || null,
          discount_type: formDiscountType,
          discount_value: parseFloat(formDiscountValue) || 0,
          max_uses: formMaxUses ? parseInt(formMaxUses) : null,
          grants_pantheon_lifetime: formGrantsPantheon,
          applies_to: formAppliesTo,
          valid_until: formValidUntil || null,
          created_by: user?.email,
        });

      if (error) throw error;

      toast({ title: "Success", description: "Discount code created!" });
      setCreateDialogOpen(false);
      resetForm();
      fetchCodes();
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to create code", 
        variant: "destructive" 
      });
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormCode('');
    setFormDescription('');
    setFormDiscountType('percentage');
    setFormDiscountValue('0');
    setFormMaxUses('');
    setFormGrantsPantheon(false);
    setFormAppliesTo('all');
    setFormValidUntil('');
  };

  const handleToggleActive = async (code: DiscountCode) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !code.is_active })
        .eq('id', code.id);

      if (error) throw error;
      fetchCodes();
    } catch (err) {
      console.error('Error toggling code:', err);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this code?')) return;
    
    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', codeId);

      if (error) throw error;
      toast({ title: "Deleted", description: "Code deleted successfully" });
      fetchCodes();
    } catch (err) {
      console.error('Error deleting code:', err);
    }
  };

  const handleRevokeRedemption = async (redemption: CodeRedemption) => {
    const reason = prompt('Reason for revoking access:');
    if (!reason) return;

    try {
      const { error } = await supabase
        .from('code_redemptions')
        .update({ 
          is_revoked: true, 
          revoked_at: new Date().toISOString(),
          revoked_reason: reason 
        })
        .eq('id', redemption.id);

      if (error) throw error;
      toast({ title: "Revoked", description: "Access has been revoked" });
      fetchRedemptions();
    } catch (err) {
      console.error('Error revoking redemption:', err);
    }
  };

  const handleVerifyPurchase = async (redemption: CodeRedemption) => {
    try {
      const { error } = await supabase
        .from('code_redemptions')
        .update({ purchase_verified: true })
        .eq('id', redemption.id);

      if (error) throw error;
      toast({ title: "Verified", description: "Purchase verified" });
      fetchRedemptions();
    } catch (err) {
      console.error('Error verifying purchase:', err);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: `${code} copied to clipboard` });
  };

  if (loading || checkingAdmin) {
    return (
      <Layout>
        <BeamsBackground />
        <div className="relative z-10 min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <BeamsBackground />
        <div className="relative z-10 min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You don't have admin access.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const codeRedemptions = (codeId: string) => 
    redemptions.filter(r => r.code_id === codeId);

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Manage Discount Codes</h1>
                <p className="text-muted-foreground">Create and manage access codes</p>
              </div>
            </div>
            
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Discount Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Code</Label>
                    <Input 
                      value={formCode} 
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      placeholder="PANTHEONLIFE"
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Input 
                      value={formDescription} 
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Lifetime Pantheon access for funnel users"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Discount Type</Label>
                      <Select value={formDiscountType} onValueChange={setFormDiscountType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="free">Free (100% off)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formDiscountType !== 'free' && (
                      <div>
                        <Label>Value</Label>
                        <Input 
                          type="number"
                          value={formDiscountValue} 
                          onChange={(e) => setFormDiscountValue(e.target.value)}
                          placeholder={formDiscountType === 'percentage' ? '10' : '5.00'}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label>Max Uses (leave empty for unlimited)</Label>
                    <Input 
                      type="number"
                      value={formMaxUses} 
                      onChange={(e) => setFormMaxUses(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <Label>Applies To</Label>
                    <Select value={formAppliesTo} onValueChange={setFormAppliesTo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="subscription">Subscription Only</SelectItem>
                        <SelectItem value="products">Specific Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Valid Until (optional)</Label>
                    <Input 
                      type="datetime-local"
                      value={formValidUntil} 
                      onChange={(e) => setFormValidUntil(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={formGrantsPantheon} 
                      onCheckedChange={setFormGrantsPantheon}
                    />
                    <Label>Grants Lifetime Pantheon Access</Label>
                  </div>
                  
                  <Button onClick={handleCreateCode} className="w-full" disabled={creating}>
                    {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Codes List */}
          <div className="space-y-4 mb-12">
            <h2 className="text-xl font-semibold">Active Codes</h2>
            
            {loadingCodes ? (
              <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : codes.length === 0 ? (
              <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border text-center">
                <p className="text-muted-foreground">No discount codes yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {codes.map((code) => (
                  <motion.div
                    key={code.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`bg-card/50 backdrop-blur-sm p-4 rounded-xl border ${code.is_active ? 'border-primary/30' : 'border-border opacity-60'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-lg font-mono font-bold">{code.code}</code>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(code.code)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{code.description}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          {code.grants_pantheon_lifetime && (
                            <Badge variant="secondary">Lifetime Pantheon</Badge>
                          )}
                          {code.discount_type === 'free' ? (
                            <Badge>100% Off</Badge>
                          ) : code.discount_type === 'percentage' ? (
                            <Badge>{code.discount_value}% Off</Badge>
                          ) : (
                            <Badge>${code.discount_value} Off</Badge>
                          )}
                          <Badge variant="outline">
                            {code.current_uses}/{code.max_uses || '∞'} uses
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedCode(selectedCode?.id === code.id ? null : code)}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          {codeRedemptions(code.id).length}
                        </Button>
                        <Switch 
                          checked={code.is_active} 
                          onCheckedChange={() => handleToggleActive(code)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCode(code.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Redemptions for this code */}
                    {selectedCode?.id === code.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="text-sm font-medium mb-2">Redemptions</h4>
                        {codeRedemptions(code.id).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No redemptions yet</p>
                        ) : (
                          <div className="space-y-2">
                            {codeRedemptions(code.id).map((r) => (
                              <div key={r.id} className="flex items-center justify-between bg-background/50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{r.user_email}</span>
                                  {r.is_revoked ? (
                                    <Badge variant="destructive">Revoked</Badge>
                                  ) : r.purchase_verified ? (
                                    <Badge variant="default">Verified</Badge>
                                  ) : (
                                    <Badge variant="secondary">Unverified</Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  {!r.purchase_verified && !r.is_revoked && (
                                    <Button variant="ghost" size="sm" onClick={() => handleVerifyPurchase(r)}>
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    </Button>
                                  )}
                                  {!r.is_revoked && (
                                    <Button variant="ghost" size="sm" onClick={() => handleRevokeRedemption(r)}>
                                      <Ban className="h-4 w-4 text-destructive" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AdminCodesPage;
