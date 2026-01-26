// Product images
import allKitsBundle from '@/assets/products/all-kits-bundle-2025.jpg';
import moonlightDrumkit from '@/assets/products/moonlight-drumkit.jpg';
import manaVol1 from '@/assets/products/mana-vol-1.png';
import hazeMidiPhrases from '@/assets/products/haze-midi-phrases.jpg';
import unrequitedLoveVol2 from '@/assets/products/unrequited-love-vol-2.png';
import unrequitedLoveVol1 from '@/assets/products/unrequited-love-vol-1.png';
import vznCompositions from '@/assets/products/vzn-compositions.jpg';
import abstractMinds from '@/assets/products/abstract-minds.jpg';
import vibrantDarkness from '@/assets/products/vibrant-darkness.jpg';
import stainedGlassVol2 from '@/assets/products/stained-glass-vol-2.jpg';
import stainedGlassVol1 from '@/assets/products/stained-glass-vol-1.jpg';
import vintageVibes from '@/assets/products/vintage-vibes.jpg';
import grayArea from '@/assets/products/gray-area.jpg';
import blackFriday from '@/assets/products/black-friday.jpg';
import theFeels from '@/assets/products/the-feels.jpg';
import floodSznVol2 from '@/assets/products/flood-szn-vol-2.png';
import floodSznVol1 from '@/assets/products/flood-szn-vol-1.jpg';

export interface SampleKit {
  id: string;
  title: string;
  image: string;
  handle: string; // Shopify product handle
  price: number;
  compareAtPrice?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  category: 'sample-kit' | 'drum-kit' | 'midi-kit' | 'bundle';
}

export const sampleKits: SampleKit[] = [
  {
    id: 'all-kits-bundle-2025',
    title: 'ALL KITS BUNDLE 2025 (LIMITED TIME SALE)',
    image: allKitsBundle,
    handle: 'all-kits-bundle',
    price: 99,
    compareAtPrice: 500,
    isOnSale: true,
    isNew: true,
    category: 'bundle',
  },
  {
    id: 'moonlight-drumkit',
    title: 'Moonlight Drumkit Vol. 1',
    image: moonlightDrumkit,
    handle: 'moonlight-drum-kit-vol-1',
    price: 25,
    compareAtPrice: 50,
    isOnSale: true,
    isNew: true,
    category: 'drum-kit',
  },
  {
    id: 'mana-vol-1',
    title: 'Mana Vol. 1',
    image: manaVol1,
    handle: 'mana-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    isOnSale: true,
    isNew: true,
    category: 'sample-kit',
  },
  {
    id: 'haze-midi-phrases',
    title: 'Haze Midi Phrases Vol. 1',
    image: hazeMidiPhrases,
    handle: 'haze-midi-phrases-vol-1',
    price: 25,
    compareAtPrice: 50,
    isOnSale: true,
    isNew: true,
    category: 'midi-kit',
  },
  {
    id: 'unrequited-love-vol-2',
    title: 'Unrequited Love Vol. 2',
    image: unrequitedLoveVol2,
    handle: 'unrequited-love-vol-2-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'unrequited-love-vol-1',
    title: 'Unrequited Love Vol. 1',
    image: unrequitedLoveVol1,
    handle: 'unrequited-love-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'vzn-compositions',
    title: 'VZN Compositions Vol. 1',
    image: vznCompositions,
    handle: 'vzn-compositions-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'abstract-minds',
    title: 'Abstract Minds Vol. 1',
    image: abstractMinds,
    handle: 'abstract-minds-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'vibrant-darkness',
    title: 'Vibrant Darkness Vol. 1',
    image: vibrantDarkness,
    handle: 'vibrant-darkness-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'stained-glass-vol-2',
    title: 'Stained Glass Vol. 2',
    image: stainedGlassVol2,
    handle: 'stained-glass-vol-2-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'stained-glass-vol-1',
    title: 'Stained Glass Vol. 1',
    image: stainedGlassVol1,
    handle: 'stained-glass-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'vintage-vibes',
    title: 'Vintage Vibes Vol. 1',
    image: vintageVibes,
    handle: 'vintage-vibes-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'gray-area',
    title: 'Gray Area Vol. 1',
    image: grayArea,
    handle: 'grey-area-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'black-friday',
    title: 'Black Friday Vol. 1',
    image: blackFriday,
    handle: 'black-friday-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'the-feels',
    title: 'The Feels Vol. 1',
    image: theFeels,
    handle: 'the-feels-vol-1-wavs',
    price: 25,
    compareAtPrice: 50,
    category: 'sample-kit',
  },
  {
    id: 'flood-szn-vol-2',
    title: 'Flood SZN Vol. 2',
    image: floodSznVol2,
    handle: 'flood-szn-vol-2-one-shots',
    price: 25,
    compareAtPrice: 50,
    category: 'drum-kit',
  },
  {
    id: 'flood-szn-vol-1',
    title: 'Flood SZN Vol. 1',
    image: floodSznVol1,
    handle: 'flood-szn-vol-1-one-shots',
    price: 25,
    compareAtPrice: 50,
    category: 'drum-kit',
  },
];
