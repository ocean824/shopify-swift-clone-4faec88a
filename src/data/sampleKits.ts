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

// Shopify CDN base URL for audio previews
const AUDIO_CDN_BASE = 'https://cdn.shopify.com/s/files/1/0797/6189/9773/files';

export interface SampleKit {
  id: string;
  title: string;
  image: string;
  wavHandle: string;
  stemsHandle?: string;
  wavPrice: number;
  stemsPrice?: number;
  compareAtPrice?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  category: 'sample-kit' | 'drum-kit' | 'midi-kit' | 'bundle';
  description: string;
  artistsLike?: string[];
  audioPreviewUrl?: string;
  // Real Shopify variant IDs for cart functionality
  shopifyWavVariantId?: string;
  shopifyStemsVariantId?: string;
  shopifyWavProductId?: string;
  shopifyStemsProductId?: string;
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
    audioPreviewUrl: `${AUDIO_CDN_BASE}/all-kits-bundle-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/47541358330110',
    shopifyWavProductId: 'gid://shopify/Product/9058722447614',
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
    description: 'Moonlight Drum Kit is a premium collection of one shots created by Niko The Great; capturing the atmosphere of late nights with crisp modern trap percussion and moody, understated textures. This kit is curated for producers looking to create polished, professional trap and R&B productions with sounds similar to Drake, PARTYNEXTDOOR, and Travis Scott.',
    artistsLike: ['Drake', 'PARTYNEXTDOOR', 'Travis Scott'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/moonlight-drumkit-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/47706892239102',
    shopifyWavProductId: 'gid://shopify/Product/9112655134974',
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
    description: 'Mana Vol. 1 is an ethereal sample kit with 11 compositions created by Niko The Great; a transcendent collection of lush soundscapes and celestial melodies crafted to awaken pure inspiration. Filled with airy pads, dreamy chords, and soulful textures, Mana channels a divine balance between serenity and power. Each composition captures the essence of spiritual energy—flowing effortlessly between ambient soul, melodic trap, and cinematic emotion. Designed to elevate your production into higher realms, these sounds serve as the perfect foundation for artists like Don Toliver, Brent Faiyaz, Travis Scott, and James Blake.',
    artistsLike: ['Don Toliver', 'Brent Faiyaz', 'Travis Scott', 'James Blake'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/mana-vol-1-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/47446768713982',
    shopifyWavProductId: 'gid://shopify/Product/9027676307710',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/47485151117566',
    shopifyStemsProductId: 'gid://shopify/Product/9044851720446',
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
    description: 'Haze Midi Phrases is a MIDI kit with 65 compositions created by Sample Society; a curated collection of smooth, evocative MIDI chord progressions designed to spark instant inspiration across R&B, Trap, and Pop. Perfect for crafting warm chords and modern harmonic textures, this kit provides the melodic foundation for creating hits similar to Future, Young Thug, Travis Scott, SZA, and Summer Walker.',
    artistsLike: ['Future', 'Young Thug', 'Travis Scott', 'SZA', 'Summer Walker'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/haze-midi-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/47538225217790',
    shopifyWavProductId: 'gid://shopify/Product/9057652211966',
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
    description: 'Unrequited Love Vol. 2 is a sample pack with 15 compositions created by Niko The Great; the highly anticipated follow-up to our hit sample pack. This collection features emotional, melodic compositions perfect for R&B and melodic hip-hop production. Piano-driven samples with lush textures create the perfect backdrop for vulnerable, heartfelt records similar to Drake, SZA, and Summer Walker.',
    artistsLike: ['Drake', 'SZA', 'Summer Walker'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/unrequited-love-vol-2-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102255247614',
    shopifyWavProductId: 'gid://shopify/Product/8082816008446',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102256558334',
    shopifyStemsProductId: 'gid://shopify/Product/8082816598270',
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
    description: 'Unrequited Love Vol. 1 is a sample pack with 15 compositions created by Niko The Great; a collection of emotional, heart-wrenching samples inspired by love and loss. Perfect for creating introspective R&B and melodic trap records, this kit delivers the raw emotion and vulnerability needed for hits similar to Bryson Tiller, PartyNextDoor, and 6LACK.',
    artistsLike: ['Bryson Tiller', 'PartyNextDoor', '6LACK'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/unrequited-love-vol-1-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102183026942',
    shopifyWavProductId: 'gid://shopify/Product/8082779734270',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102227362046',
    shopifyStemsProductId: 'gid://shopify/Product/8082802278654',
  },
  {
    id: 'vzn-compositions',
    title: 'VZN Compositions Vol. 1',
    image: vznCompositions,
    wavHandle: 'vzn-compositions-vol-1-wavs',
    wavPrice: 25,
    category: 'sample-kit',
    description: 'VZN Compositions Vol. 1 is a sample pack with 10 compositions created by VZN; featuring futuristic soundscapes and innovative textures built for producers who want to push boundaries and create forward-thinking music. These visionary compositions capture the essence of modern trap production with sounds similar to Travis Scott, Kid Cudi, and Don Toliver.',
    artistsLike: ['Travis Scott', 'Kid Cudi', 'Don Toliver'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/vzn-compositions-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102259015934',
    shopifyWavProductId: 'gid://shopify/Product/8082817941758',
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
    description: 'Abstract Minds is a sample pack with 10 compositions created by Sample Society; a conceptual dream for those who let their creativity thrive when it comes to musical expression. Full of vibrant and hypnotic compositions that feature a plethora of mesmerizing instrumentations. Abstract Minds is curated for those who truly embrace being unique, and are ready to access a side of creativity previously unimaginable. The rich sounds from this kit will help create an immersive and refined sound similar to the likes of Don Toliver, Travis Scott, Jay2, and Sofaygo.',
    artistsLike: ['Don Toliver', 'Travis Scott', 'Jay2', 'Sofaygo'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/abstract-minds-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102261276926',
    shopifyWavProductId: 'gid://shopify/Product/8082819088638',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102261768446',
    shopifyStemsProductId: 'gid://shopify/Product/8082819481854',
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
    description: 'Vibrant Darkness is a sample pack with 15 compositions created by Sample Society; dark, atmospheric compositions with rich textures and haunting melodies. Perfect for producers looking to create moody, cinematic beats with a unique edge. The deep, immersive sounds from this kit deliver the perfect foundation for trap and R&B anthems similar to Travis Scott, Don Toliver, and Metro Boomin.',
    artistsLike: ['Travis Scott', 'Don Toliver', 'Metro Boomin'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/vibrant-darkness-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102264062206',
    shopifyWavProductId: 'gid://shopify/Product/8082820792574',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102265045246',
    shopifyStemsProductId: 'gid://shopify/Product/8082821153022',
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
    description: 'Stained Glass Vol. 2 is a sample pack with 10 compositions created by Sample Society; the sequel to our beloved angelic harmonies collection. These soft blissful melodies allow for you to create rich yet peaceful compositions that soothe the soul, featuring even more experimental sounds and melodic textures. Perfect for creating sounds similar to Pharrell, Chad Hugo, and The Neptunes.',
    artistsLike: ['Pharrell', 'Chad Hugo', 'The Neptunes'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/stained-glass-vol-2-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102269239550',
    shopifyWavProductId: 'gid://shopify/Product/8082824331518',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102270058750',
    shopifyStemsProductId: 'gid://shopify/Product/8082824855806',
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
    description: 'Stained Glass is a sample pack with 10 compositions created by Sample Society; an ode to angelic harmonies, and an essential kit to take soothing tones wherever your imagination desires. These soft blissful melodies allow for you to create rich yet peaceful compositions that soothe the soul. These soft sounds pay homage to the likes of Jhene Aiko, SZA, Kehlani and Gywnn Bynn.',
    artistsLike: ['Jhene Aiko', 'SZA', 'Kehlani', 'Gywnn Bynn'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/stained-glass-vol-1-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102266650878',
    shopifyWavProductId: 'gid://shopify/Product/8082822267134',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102268223742',
    shopifyStemsProductId: 'gid://shopify/Product/8082823545086',
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
    description: 'Vintage Vibes is a sample pack with 10 compositions created by Sample Society; a fresh twist on beloved vintage sounds purposefully curated to bring life and color to your DAW. The expressive and soulful nature of these compositions are sure to make your imagination run wild to the endless possibilities offered from this soundkit. The lush synths and angelic melodies spread throughout this kit offer a comfortably nostalgic feel while opening new doors of creativity at the same time. Utilize these vintage vibes to create sounds similar to Anderson Paak, Flying Lotus, and Tame Impala.',
    artistsLike: ['Anderson Paak', 'Flying Lotus', 'Tame Impala'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/vintage-vibes-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102272483582',
    shopifyWavProductId: 'gid://shopify/Product/8082826330366',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102273204478',
    shopifyStemsProductId: 'gid://shopify/Product/8082826821886',
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
    description: 'Gray Area is a sample pack with 15 compositions created by Niko The Great; full of samples that will guide your mind to wonder through the countless unknowns of life. The melancholic yet heartfelt nature of this kit is curated to bring comfort and a place to find solace all while leaving room for the imagination to wonder. The Grey Area is not to be shied away from in this case as fully immersing yourself in this sound will help create moody and eerie trap and R&B anthems using sounds similar to Drake, Rory, 40 and PartyNextDoor.',
    artistsLike: ['Drake', 'Rory', '40', 'PartyNextDoor'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/grey-area-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102275203326',
    shopifyWavProductId: 'gid://shopify/Product/8082828263678',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102276186366',
    shopifyStemsProductId: 'gid://shopify/Product/8082828722430',
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
    description: 'Black Friday is a sample pack with 20 compositions created by Sample Society; full of luxuriant and vibrant samples with a variety of profuse textures. Black Friday is truly one of the more diverse kits offered, containing a variety of immersive vibes and elegant tonal inflections, you can rely on this kit to cover all forms of personal and musical expression. Birthed in the idea of true limitless creativity and endless options with sounds similar to Mike Dean, Toro y Moi, A$AP Rocky, and Ryan Louis.',
    artistsLike: ['Mike Dean', 'Toro y Moi', 'A$AP Rocky', 'Ryan Louis'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/black-friday-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102278021374',
    shopifyWavProductId: 'gid://shopify/Product/8082829836542',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102278250750',
    shopifyStemsProductId: 'gid://shopify/Product/8082830000382',
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
    description: 'The Feels is a sample pack with 15 compositions created by Sample Society; emotional, feeling-driven compositions that hit right in the heart. Perfect for creating vulnerable, introspective R&B and hip-hop records. These soul-stirring samples provide the perfect backdrop for emotional storytelling similar to Drake, The Weeknd, and Bryson Tiller.',
    artistsLike: ['Drake', 'The Weeknd', 'Bryson Tiller'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/the-feels-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102279987454',
    shopifyWavProductId: 'gid://shopify/Product/8082831016190',
    shopifyStemsVariantId: 'gid://shopify/ProductVariant/44102288507134',
    shopifyStemsProductId: 'gid://shopify/Product/8082835144958',
  },
  {
    id: 'flood-szn-vol-2',
    title: 'Flood SZN Vol. 2',
    image: floodSznVol2,
    wavHandle: 'flood-szn-vol-2-one-shots',
    wavPrice: 25,
    category: 'drum-kit',
    description: 'Flood Season Vol. 2 is a drumkit filled with one shots created by our in house producer VZN; an essential kit for making high quality trap beats sure to shake the room. The second volume to VZN\'s signature drumkit, look no further if you\'re looking for a one shot drum kit full of unique sounds that are up to industry standard trap sounds.',
    artistsLike: ['Lil Baby', 'Gunna', 'Young Thug'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/flood-szn-vol-2-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102299287806',
    shopifyWavProductId: 'gid://shopify/Product/8082840977662',
  },
  {
    id: 'flood-szn-vol-1',
    title: 'Flood SZN Vol. 1',
    image: floodSznVol1,
    wavHandle: 'flood-szn-vol-1-one-shots',
    wavPrice: 25,
    category: 'drum-kit',
    description: 'Flood Season Vol. 1 is a drumkit filled with one shots created by our in house producer VZN; the original Flood SZN drum kit featuring hard-hitting one-shots that will make your drums stand out. Industry-quality sounds used in major placements with sounds similar to Metro Boomin, Southside, and TM88.',
    artistsLike: ['Metro Boomin', 'Southside', 'TM88'],
    audioPreviewUrl: `${AUDIO_CDN_BASE}/flood-szn-vol-1-preview.mp3`,
    shopifyWavVariantId: 'gid://shopify/ProductVariant/44102296240382',
    shopifyWavProductId: 'gid://shopify/Product/8082839175422',
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
