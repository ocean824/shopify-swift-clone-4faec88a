import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDiscountStore } from '@/stores/discountStore';
import { useToast } from '@/hooks/use-toast';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasSignupDiscount, setSignupDiscount, isEmailUsed, isPhoneUsed } = useDiscountStore();
  const { toast } = useToast();

  useEffect(() => {
    const dismissed = sessionStorage.getItem('popup-dismissed');
    
    if (!hasSignupDiscount && !dismissed) {
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
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email.",
        variant: "destructive",
      });
      return;
    }

    // Check if email or phone already used
    if (isEmailUsed(email)) {
      toast({
        title: "Email Already Used",
        description: "This email has already claimed a discount.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (isPhoneUsed(phone)) {
      toast({
        title: "Phone Already Used",
        description: "This phone number has already claimed a discount.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSignupDiscount({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    
    toast({
      title: "🎉 10% Off Applied!",
      description: "Your discount will be applied at checkout.",
    });
    
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-32 inset-x-0 z-50 flex justify-center px-4"
        >
          <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden w-72">
            {/* Header */}
            <div className="bg-primary/10 px-3 py-2 relative">
              <div className="flex items-center justify-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Get 10% Off</span>
              </div>
              <button
                onClick={handleClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-background/50 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-3 space-y-2">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background h-8 text-xs"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background h-8 text-xs"
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background h-8 text-xs"
              />
              
              <Button
                type="submit"
                size="sm"
                className="w-full h-8 text-xs gap-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Applying...' : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    Unlock 10% Off
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
