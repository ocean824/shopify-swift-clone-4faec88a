import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot' | 'magic';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (mode) {
        case 'login': {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          navigate('/members');
          break;
        }

        case 'signup': {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin + '/members',
              data: {
                display_name: displayName,
              },
            },
          });
          if (error) throw error;
          toast({
            title: "Account created!",
            description: "You can now sign in to your account.",
          });
          setMode('login');
          break;
        }

        case 'forgot': {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/auth?reset=true',
          });
          if (error) throw error;
          toast({
            title: "Reset link sent!",
            description: `Check ${email} for a password reset link.`,
          });
          setMode('login');
          break;
        }

        case 'magic': {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: window.location.origin + '/members',
            },
          });
          if (error) throw error;
          toast({
            title: "Magic link sent!",
            description: `Check ${email} for a sign-in link.`,
          });
          break;
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'magic': return 'Magic Link Sign In';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Send Reset Link';
      case 'magic': return 'Send Magic Link';
    }
  };

  const getLoadingText = () => {
    switch (mode) {
      case 'login': return 'Signing in...';
      case 'signup': return 'Creating account...';
      case 'forgot': return 'Sending reset link...';
      case 'magic': return 'Sending magic link...';
    }
  };

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16 min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
            <h1 className="text-2xl font-bold text-center mb-2">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {mode === 'login' && 'Use the email from your purchase'}
              {mode === 'signup' && 'Create an account with your purchase email'}
              {mode === 'forgot' && 'We\'ll send you a reset link'}
              {mode === 'magic' && 'Sign in without a password'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {(mode === 'login' || mode === 'signup') && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {getLoadingText()}
                  </>
                ) : (
                  getButtonText()
                )}
              </Button>
            </form>

            {/* Alternative sign-in options */}
            {mode === 'login' && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setMode('magic')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign in with Magic Link
                </Button>
              </div>
            )}

            {/* Navigation links */}
            <div className="mt-6 space-y-2 text-center">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Don't have an account? <span className="text-primary">Sign up</span>
                  </button>
                </>
              )}

              {mode === 'signup' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Already have an account? <span className="text-primary">Sign in</span>
                </button>
              )}

              {(mode === 'forgot' || mode === 'magic') && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AuthPage;
