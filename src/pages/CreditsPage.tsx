import { Layout } from '@/components/layout/Layout';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const credits = [
  { song: "Street", artist: "G Herbo", album: "Humble Beast" },
  { song: "Chase tha Bag", artist: "Roddy Ricch", album: "Feed tha Streets" },
  { song: "Common Ground", artist: "Jack Harlow", album: "Jackman." },
  { song: "On God (feat. KayCyy)", artist: "Fivio Foreign", album: "B.I.B.L.E." },
  { song: "Genie", artist: "YoungBoy Never Broke Again", album: "Until Death Call My Name Reloaded" },
  { song: "Can't Be Saved", artist: "YoungBoy Never Broke Again", album: "4Respect 4Freedom 4Loyalty 4WhatImportant" },
  { song: "Walk By Faith (feat. Josh Kream)", artist: "Maxo Kream", album: "Personification" },
  { song: "Hold Back Tears", artist: "Conway the Machine", album: "You Can't Kill God With Bullets" },
  { song: "GOLDTOOTH (feat. Blaqbonez)", artist: "Knucks", album: "A Fine African Man" },
  { song: "Out of Respect", artist: "Teezo Touchdown", album: "How Do You Sleep At Night? With You" },
  { song: "Shmurda Talk (feat. Rowdy Rebel)", artist: "Doe Boy", album: "Shmurda Talk - Single" },
  { song: "Adderall", artist: "Loe Shimmy, Fredo Bang", album: "Zombieland 2.6" },
  { song: "Bornstar (feat. Bratzbih)", artist: "DETO BLACK", album: "Bornstar - Single" },
  { song: "BETHLEHEM/SC FREESTYLE", artist: "VIC MENSA", album: "V TAPE" },
  { song: "Palm Trees", artist: "PHABO", album: "Soulquarius" },
  { song: "Luv Me Back", artist: "PHABO", album: "Before I Let Her Go - EP" },
  { song: "Ball", artist: "Michael Christmas", album: "Role Model" },
  { song: "GRAND CHERRY", artist: "Reuben Vincent", album: "GRAND CHERRY - Single" },
  { song: "Abundance", artist: "Jay2", album: "Send Heartss" },
  { song: "Keep Me Around", artist: "AUGUST 08", album: "Keep Me Around - Single" },
  { song: "i'll never forgive you", artist: "Angelo Mota", album: "i changed my mind" },
  { song: "poster CHILD", artist: "Ausar, Dende, Sam Williams", album: "I Now Know." },
  { song: "PLEAsure", artist: "Ausar, Senite", album: "I Now Know." },
  { song: "Win", artist: "Ausar, Tri Nohbi", album: "I Now Know." },
  { song: "Missing You", artist: "BJRNCK", album: "A Girl Like Me" },
  { song: "Red Eye", artist: "Gnarly Brown", album: "Orange Rose - EP" },
  { song: "Add Gin (feat. Niko the Great)", artist: "Gnarly Brown, Fee4Three", album: "5 Songs - EP" },
  { song: "Tabernacle", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "Earth is The Trap", artist: "Fee4Three", album: "Earth is TheTrap" },
  { song: "No Angel", artist: "Lei Dominique", album: "No Angel - Single" },
];

export default function CreditsPage() {
  return (
    <Layout>
      <section className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Production Credits
        </h1>
        <p className="mt-4 text-muted-foreground">
          Music produced, co-produced, or featuring Sample Society sounds
        </p>

        <div className="mt-6">
          <Button variant="outline" className="gap-2" asChild>
            <a 
              href="https://music.apple.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              View on Apple Music
            </a>
          </Button>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="bg-card">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Song
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Artist
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                  Album
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {credits.map((credit, index) => (
                <tr 
                  key={index} 
                  className="transition-colors hover:bg-card/50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {credit.song}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {credit.artist}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {credit.album}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {credits.length} Total Placements
        </p>
      </section>
    </Layout>
  );
}
