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
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Here at Sample Society we invite all talented producers, beatmakers, and instrumentalists, serious enough about their craft to apply to sell works on our platform with our full support. We are more than open to building with other creative professionals and will lend the aid of our team once we find interest in an application and form an agreement with the applicant.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              We accept up to three applications from each applicant total; we will review no more than one application at a time per applicant & we will contact you after our review if interested. Feel free to apply below & potentially become a member.
            </p>
            
            <Button asChild size="lg" className="w-full">
              <a href="https://fs8.formsite.com/tYqVRc/w1jabvvuvr/index.html" target="_blank" rel="noopener noreferrer">
                APPLY NOW
              </a>
            </Button>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ApplyPage;
