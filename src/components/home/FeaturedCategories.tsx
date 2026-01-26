import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Sample Packs',
    description: 'Loops, one-shots & textures',
    href: '/collections/sample-packs',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop',
    count: '50+ Packs',
  },
  {
    name: 'MIDI Kits',
    description: 'Melodies & chord progressions',
    href: '/collections/midi-kits',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
    count: '30+ Kits',
  },
  {
    name: 'Drum Kits',
    description: '808s, kicks, hi-hats & more',
    href: '/collections/drum-kits',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=400&fit=crop',
    count: '40+ Kits',
  },
];

export function FeaturedCategories() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold uppercase tracking-tight">Shop By Category</h2>
        <p className="mt-2 text-muted-foreground">
          Find exactly what you need for your next hit
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link
              to={category.href}
              className="group relative block aspect-[3/2] overflow-hidden rounded-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {category.count}
                </span>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}