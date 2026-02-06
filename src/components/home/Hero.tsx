import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.png';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Hero Banner Image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        <img 
          src={heroBanner} 
          alt="Sample Society"
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      </div>
      
      {/* Content below banner */}
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="gap-2">
            <Link to="/bundle">
              All Kits Bundle
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/merch">
              Shop Merch
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
