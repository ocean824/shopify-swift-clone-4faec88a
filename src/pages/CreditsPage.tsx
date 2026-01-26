import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Credit {
  song: string;
  artist: string;
  album: string;
}

const credits: Credit[] = [
  { song: "i'll never forgive you", artist: "Angelo Mota", album: "i changed my mind" },
  { song: "Keep Me Around", artist: "AUGUST 08", album: "Keep Me Around - Single" },
  { song: "Fefifo", artist: "aubreykingx", album: "Pregame - EP" },
  { song: "I Now Know.", artist: "Ausar", album: "I Now Know." },
  { song: "poster CHILD", artist: "Ausar, Dende, Sam Williams & Selah St. Sabina Youth Choir", album: "I Now Know." },
  { song: "PLEAsure", artist: "Ausar, Senite", album: "I Now Know." },
  { song: "Win", artist: "Ausar, Tri Nohbi", album: "I Now Know." },
  { song: "Missing You", artist: "BJRNCK", album: "A Girl Like Me" },
  { song: "Hold Back Tears", artist: "Conway the Machine", album: "You Can't Kill God With Bullets" },
  { song: "Bornstar (feat. Bratzbih)", artist: "DETO BLACK", album: "Bornstar (feat. Bratzbih) - Single" },
  { song: "Shmurda Talk (feat. Rowdy Rebel)", artist: "Doe Boy", album: "Shmurda Talk (feat. Rowdy Rebel) - Single" },
  { song: "Grown", artist: "Dom Sarfo", album: "Grown - Single" },
  { song: "6AM", artist: "Fee4Three", album: "6AM - Single" },
  { song: "Earth is The Trap", artist: "Fee4Three", album: "Earth is TheTrap" },
  { song: "Finally, I Vent", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "Gossip", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "Tabernacle", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "Useless II", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "On God (feat. KayCyy)", artist: "Fivio Foreign", album: "B.I.B.L.E." },
  { song: "B Word Demo", artist: "Foggieraw", album: "Fogtavious Vandross 2" },
  { song: "Street", artist: "G Herbo", album: "Humble Beast" },
  { song: "balance", artist: "Garrett Zoukis", album: "ZOU" },
  { song: "Red Eye", artist: "Gnarly Brown", album: "Orange Rose - EP" },
  { song: "Add Gin (feat. Niko the Great)", artist: "Gnarly Brown, Fee4Three", album: "5 Songs - EP" },
  { song: "B******t (feat. Niko the Great)", artist: "Gnarly Brown, Fee4Three", album: "5 Songs - EP" },
  { song: "FRITO LAY", artist: "isaiah Rusk", album: "Happily Ever AFTRs - EP" },
  { song: "Common Ground", artist: "Jack Harlow", album: "Jackman." },
  { song: "Abundance", artist: "Jay2", album: "Send Heartss" },
  { song: "Arm N Leg (feat. Bari)", artist: "Jay2", album: "Send Heartss" },
  { song: "Stay In", artist: "Jay2", album: "Send Heartss" },
  { song: "GOLDTOOTH (feat. Blaqbonez)", artist: "Knucks", album: "A Fine African Man" },
  { song: "No Angel", artist: "Lei Dominique", album: "No Angel - Single" },
  { song: "Adderall", artist: "Loe Shimmy, Fredo Bang", album: "Zombieland 2.6" },
  { song: "Walk By Faith (feat. Josh Kream)", artist: "Maxo Kream", album: "Personification" },
  { song: "Ball", artist: "Michael Christmas", album: "Role Model" },
  { song: "Butler (feat. Maceo & Aaliyah Allah)", artist: "Myquale", album: "Heard Well Collection, Vol. 18" },
  { song: "& Then There Were Two", artist: "myquale", album: "Above All" },
  { song: "Above All (feat. KETU & Denzel Lavell)", artist: "myquale", album: "Above All" },
  { song: "fortyfour4's", artist: "myquale", album: "fortyfour4's - Single" },
  { song: "Isolation", artist: "myquale", album: "Isolation - Single" },
  { song: "North (feat. Trapo)", artist: "myquale", album: "North (feat. Trapo) - Single" },
  { song: "Hold Me Close", artist: "Nali", album: "No Spaces - Single" },
  { song: "Thokoza (feat. ASAP Shembe)", artist: "NLite.", album: "Remix - EP" },
  { song: "Alone in LA", artist: "Oranj Goodman", album: "Alone in LA - Single" },
  { song: "Evol", artist: "Outernet", album: "Evol - Single" },
  { song: "PEARLS", artist: "Devin Malik", album: "DEADSTOCK" },
  { song: "Luv Me Back", artist: "PHABO", album: "Before I Let Her Go - EP" },
  { song: "Palm Trees", artist: "PHABO", album: "Soulquarius" },
  { song: "Zoo (feat. Elton Aura)", artist: "Qari", album: "Igotproblems - EP" },
  { song: "GRAND CHERRY", artist: "Reuben Vincent", album: "GRAND CHERRY - Single" },
  { song: "Chase tha Bag", artist: "Roddy Ricch", album: "Feed tha Streets" },
  { song: "Hmm", artist: "Seddy Hendrinx, Quay Global", album: "BLITZ" },
  { song: "Mr. DJ", artist: "Tahjer", album: "Mr. DJ - Single" },
  { song: "Out of Respect", artist: "Teezo Touchdown", album: "How Do You Sleep At Night? With You" },
  { song: "Bad Habits", artist: "The Other Eric", album: "Bad Habits - Single" },
  { song: "Best Mistake (feat. Niko The Great)", artist: "The Other Eric", album: "Broken Cookies - Single" },
  { song: "Blown Away", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Cut Off", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Cut Off", artist: "The Other Eric", album: "Cut Off - Single" },
  { song: "Felt This Way", artist: "The Other Eric", album: "Felt This Way - Single" },
  { song: "Let Me Down (feat. Chanelle Truvillion)", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Like This (Version 1)", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Overblown (feat. Niko The Great)", artist: "The Other Eric", album: "Broken Cookies - Single" },
  { song: "Purest (feat. Niko The Great)", artist: "The Other Eric", album: "Broken Cookies - Single" },
  { song: "Tell Nobody", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Tell Nobody", artist: "The Other Eric", album: "Tell Nobody - Single" },
  { song: "Temporary", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "The Plug", artist: "The Other Eric", album: "The Plug - Single" },
  { song: "You Know Better", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "THREW MY LIFE AWAY", artist: "Tweetsie Baby", album: "THREW MY LIFE AWAY - Single" },
  { song: "BETHLEHEM/SC FREESTYLE", artist: "VIC MENSA", album: "V TAPE" },
  { song: "Call Her Bae", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Frosty (feat. Jay2)", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Got Weight", artist: "Young Pink", album: "Neva Look Back" },
  { song: "In the Mix", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Make Em Sick", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Outlaw", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Set Fire", artist: "Young Pink", album: "F*@k It... Burn It All Down" },
  { song: "Can't Be Saved", artist: "YoungBoy Never Broke Again", album: "4Respect 4Freedom 4Loyalty 4WhatImportant" },
  { song: "Genie", artist: "YoungBoy Never Broke Again", album: "Until Death Call My Name Reloaded" },
];

export default function CreditsPage() {
  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Music className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">Credits</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {credits.length} Total Placements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm rounded-xl border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-primary font-bold uppercase tracking-wider">Song</TableHead>
                  <TableHead className="text-primary font-bold uppercase tracking-wider">Artist</TableHead>
                  <TableHead className="text-primary font-bold uppercase tracking-wider hidden md:table-cell">Album</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credits.map((credit, index) => (
                  <TableRow 
                    key={`${credit.song}-${credit.artist}-${index}`}
                    className="border-border hover:bg-primary/5"
                  >
                    <TableCell className="font-medium">{credit.song}</TableCell>
                    <TableCell className="text-muted-foreground">{credit.artist}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{credit.album}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
