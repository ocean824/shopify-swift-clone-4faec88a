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
  wavHandle: string; // Shopify product handle for WAV version
  stemsHandle?: string; // Shopify product handle for Stems version (if available)
  wavPrice: number;
  stemsPrice?: number;
  compareAtPrice?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  category: 'sample-kit' | 'drum-kit' | 'midi-kit' | 'bundle';
  description: string;
  artistsLike?: string[];
  audioPreviewUrl?: string;
}

export const sampleKits: SampleKit[] = [
  {
    id: 'all-kits-bundle-2025',
    title: 'ALL KITS BUNDLE 2025 (LIMITED TIME SALE)',
    image: allKitsBundle,
    wavHandle: 'all-kits-bundle',
    wavPrice: 99,
    compareAtPrice: 500,
    isOnSale: true,
    isNew: true,
    category: 'bundle',
    description: 'Get EVERY Sample Society kit in one massive bundle. Includes all sample packs, drum kits, MIDI files, and stems. Over 2,000+ sounds at an unbeatable price. Limited time offer.',
    artistsLike: ['Travis Scott', 'Don Toliver', 'Drake', 'Metro Boomin'],
  },
  {
    id: 'moonlight-drumkit',
    title: 'Moonlight Drum Kit Vol. 1',
    image: moonlightDrumkit,
    wavHandle: 'moonlight-drum-kit-vol-1',
    wavPrice: 25,
    compareAtPrice: 50,
    isOnSale: true,
    isNew: true,
    category: 'drum-kit',
    description: 'Moonlight Drum Kit captures the atmosphere of late nights with crisp modern trap percussion and moody, understated textures. Perfect for melodic trap, R&B-infused trap, and dark late-night production.',
    artistsLike: ['Drake', 'PARTYNEXTDOOR', 'Travis Scott'],
  },
  {
    id: 'mana-vol-1',
    title: 'Mana Vol. 1',
    image: manaVol1,
    wavHandle: 'mana-vol-1-wavs',
    stemsHandle: 'mana-vol-1-stems',
    wavPrice: 25,
    stemsPrice: 50,
    compareAtPrice: 50,
    isOnSale: true,
    isNew: true,
    category: 'sample-kit',
    description: 'An ethereal collection of lush soundscapes and celestial melodies crafted to awaken pure inspiration. Filled with airy pads, dreamy chords, and soulful textures that channel a divine balance between serenity and power.',
    artistsLike: ['Don Toliver', 'Brent Faiyaz', 'Travis Scott', 'James Blake'],
  },
  {
    id: 'haze-midi-phrases',
    title: 'Haze Midi Phrases Vol. 1',
    image: hazeMidiPhrases,
    wavHandle: 'haze-midi-phrases-vol-1',
    wavPrice: 25,
    compareAtPrice: 50,
    isOnSale: true,
    isNew: true,
    category: 'midi-kit',
    description: 'Premium MIDI phrases and chord progressions designed for modern producers. Create unique melodies with these versatile MIDI files that work with any synth or instrument.',
    artistsLike: ['Metro Boomin', 'Southside', 'Wheezy'],
  },
  {
    id: 'unrequited-love-vol-2',
    title: 'Unrequited Love Vol. 2',
    image: unrequitedLoveVol2,
    wavHandle: 'unrequited-love-vol-2-wavs',
    stemsHandle: 'unrequited-love-vol-2-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'The follow-up to our hit sample pack. Emotional, melodic compositions perfect for R&B and melodic hip-hop production. Features piano-driven samples with lush textures.',
    artistsLike: ['Drake', 'SZA', 'Summer Walker'],
  },
  {
    id: 'unrequited-love-vol-1',
    title: 'Unrequited Love Vol. 1',
    image: unrequitedLoveVol1,
    wavHandle: 'unrequited-love-vol-1-wavs',
    stemsHandle: 'unrequited-love-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'A collection of emotional, heart-wrenching samples inspired by love and loss. Perfect for creating introspective R&B and melodic trap records.',
    artistsLike: ['Bryson Tiller', 'PartyNextDoor', '6LACK'],
  },
  {
    id: 'vzn-compositions',
    title: 'VZN Compositions Vol. 1',
    image: vznCompositions,
    wavHandle: 'vzn-compositions-vol-1-wavs',
    wavPrice: 25,
    category: 'sample-kit',
    description: 'Visionary compositions featuring futuristic soundscapes and innovative textures. Built for producers who want to push boundaries and create forward-thinking music.',
    artistsLike: ['Travis Scott', 'Kid Cudi', 'Don Toliver'],
  },
  {
    id: 'abstract-minds',
    title: 'Abstract Minds Vol. 1',
    image: abstractMinds,
    wavHandle: 'abstract-minds-vol-1-wavs',
    stemsHandle: 'abstract-minds-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'Experimental and abstract sample compositions that defy convention. Features unconventional sounds and unique textures for producers looking to stand out.',
    artistsLike: ['Kanye West', 'Tyler, The Creator', 'Frank Ocean'],
  },
  {
    id: 'vibrant-darkness',
    title: 'Vibrant Darkness Vol. 1',
    image: vibrantDarkness,
    wavHandle: 'vibrant-darkness-vol-1-wavs',
    stemsHandle: 'vibrant-darkness-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'Dark, atmospheric compositions with rich textures and haunting melodies. Perfect for producers looking to create moody, cinematic beats with a unique edge.',
    artistsLike: ['Travis Scott', 'Don Toliver', 'Metro Boomin'],
  },
  {
    id: 'stained-glass-vol-2',
    title: 'Stained Glass Vol. 2',
    image: stainedGlassVol2,
    wavHandle: 'stained-glass-vol-2-wavs',
    stemsHandle: 'stained-glass-vol-2-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'Colorful, vibrant samples with a unique blend of organic and synthetic textures. The sequel features even more experimental sounds and melodic compositions.',
    artistsLike: ['Pharrell', 'Chad Hugo', 'The Neptunes'],
  },
  {
    id: 'stained-glass-vol-1',
    title: 'Stained Glass Vol. 1',
    image: stainedGlassVol1,
    wavHandle: 'stained-glass-vol-1-wavs',
    stemsHandle: 'stained-glass-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'A kaleidoscope of sounds featuring rich, textured samples with vibrant colors and unique character. Perfect for creating standout productions.',
    artistsLike: ['Steve Lacy', 'Tyler, The Creator', 'Tame Impala'],
  },
  {
    id: 'vintage-vibes',
    title: 'Vintage Vibes Vol. 1',
    image: vintageVibes,
    wavHandle: 'vintage-vibes-vol-1-wavs',
    stemsHandle: 'vintage-vibes-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'Classic, soulful samples with a vintage aesthetic. Features warm analog textures, vinyl crackle, and timeless melodies perfect for boom bap and neo-soul.',
    artistsLike: ['J. Cole', 'Kendrick Lamar', 'Anderson .Paak'],
  },
  {
    id: 'gray-area',
    title: 'Gray Area Vol. 1',
    image: grayArea,
    wavHandle: 'grey-area-vol-1-wavs',
    stemsHandle: 'grey-area-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'Moody, atmospheric samples that exist between light and dark. Features ambient textures and emotional compositions for introspective productions.',
    artistsLike: ['Giveon', 'Daniel Caesar', 'Brent Faiyaz'],
  },
  {
    id: 'black-friday',
    title: 'Black Friday Vol. 1',
    image: blackFriday,
    wavHandle: 'black-friday-vol-1-wavs',
    stemsHandle: 'black-friday-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'Hard-hitting, aggressive samples perfect for trap and drill production. Dark, menacing textures with heavy 808-ready compositions.',
    artistsLike: ['Future', '21 Savage', 'Young Thug'],
  },
  {
    id: 'the-feels',
    title: 'The Feels Vol. 1',
    image: theFeels,
    wavHandle: 'the-feels-vol-1-wavs',
    stemsHandle: 'the-feels-vol-1-trackouts',
    wavPrice: 25,
    stemsPrice: 50,
    category: 'sample-kit',
    description: 'Emotional, feeling-driven compositions that hit right in the heart. Perfect for creating vulnerable, introspective R&B and hip-hop records.',
    artistsLike: ['Drake', 'The Weeknd', 'Bryson Tiller'],
  },
  {
    id: 'flood-szn-vol-2',
    title: 'Flood SZN Vol. 2',
    image: floodSznVol2,
    wavHandle: 'flood-szn-vol-2-one-shots',
    wavPrice: 25,
    category: 'drum-kit',
    description: 'Premium one-shots and drum sounds for modern trap production. Crisp 808s, punchy kicks, and snappy snares ready to flood your beats.',
    artistsLike: ['Lil Baby', 'Gunna', 'Young Thug'],
  },
  {
    id: 'flood-szn-vol-1',
    title: 'Flood SZN Vol. 1',
    image: floodSznVol1,
    wavHandle: 'flood-szn-vol-1-one-shots',
    wavPrice: 25,
    category: 'drum-kit',
    description: 'The original Flood SZN drum kit featuring hard-hitting one-shots that will make your drums stand out. Industry-quality sounds used in major placements.',
    artistsLike: ['Metro Boomin', 'Southside', 'TM88'],
  },
];

// Helper function to find a kit by its handle (either WAV or Stems)
export function findKitByHandle(handle: string): SampleKit | undefined {
  return sampleKits.find(kit => 
    kit.wavHandle === handle || kit.stemsHandle === handle
  );
}

// Helper function to get related kits
export function getRelatedKits(currentKit: SampleKit, limit = 4): SampleKit[] {
  return sampleKits
    .filter(kit => kit.id !== currentKit.id && kit.category === currentKit.category)
    .slice(0, limit);
}
