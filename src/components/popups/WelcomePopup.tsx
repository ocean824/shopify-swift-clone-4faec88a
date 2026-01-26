import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDiscountStore } from '@/stores/discountStore';
import { useToast } from '@/hooks/use-toast';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasSignupDiscount, setSignupDiscount } = useDiscountStore();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user already has discount or dismissed popup this session
    const dismissed = sessionStorage.getItem('popup-dismissed');
    
    if (!hasSignupDiscount && !dismissed) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasSignupDiscount]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('popup-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to unlock your discount.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSignupDiscount({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    
    toast({
      title: "🎉 Discount Unlocked!",
      description: "You now get an extra 10% off all bundles!",
    });
    
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden w-full max-w-xs">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-4 text-center relative">
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-background/50 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
                
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                
                <h2 className="text-lg font-bold text-foreground mb-1">
                  Unlock 10% Off
                </h2>
                <p className="text-muted-foreground text-xs">
                  Join & get 10% off your order!
                </p>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="popup-name" className="text-xs">Name</Label>
                  <Input
                    id="popup-name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="popup-email" className="text-xs">Email</Label>
                  <Input
                    id="popup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="popup-phone" className="text-xs">Phone</Label>
                  <Input
                    id="popup-phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background h-9 text-sm"
                  />
                </div>
                
                <Button
                  type="submit"
                  size="sm"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Unlocking...'
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      Unlock Discount
                    </>
                  )}
                </Button>
                
                <p className="text-[10px] text-center text-muted-foreground">
                  We respect your privacy.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
