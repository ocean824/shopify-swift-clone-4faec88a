import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ApplyPage = () => {
  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <UserPlus className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">Apply</h1>
            <p className="text-muted-foreground">
              Join the Sample Society team. Submit your application below.
            </p>
          </div>

          <form className="space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio / Social Link</Label>
              <Input id="portfolio" placeholder="https://..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Tell us about yourself</Label>
              <Textarea 
                id="message" 
                placeholder="What do you bring to the table?"
                rows={5}
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full">
              Submit Application
            </Button>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ApplyPage;
