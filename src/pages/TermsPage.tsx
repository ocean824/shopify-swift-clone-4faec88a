import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <FileText className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">
              Sample Society Terms of Use
            </h1>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-border space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                SAMPLE SOCIETY MASTER USE LICENSE AGREEMENT
              </h2>
              <p className="text-muted-foreground italic">
                (Effective Upon Purchase or Download)
              </p>
            </div>

            <p className="text-foreground">
              This Master Use License Agreement ("Agreement") is entered into by and between Sample Society ("Licensor"), acting on behalf of its affiliated producers, composers, and sound designers (collectively, the "Creators"), and the purchaser or user ("Licensee" or "Client").
            </p>

            <p className="text-foreground">
              By purchasing, downloading, or otherwise obtaining any sound recordings, compositions, or sample packs ("Materials") from this website, Licensee agrees to be legally bound by the terms of this Agreement.
            </p>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">1. GRANT OF LICENSE</h3>
              <p className="text-foreground mb-4">
                Licensor hereby grants to Licensee a non-exclusive, non-transferable, worldwide license to use the Materials in Licensee's own musical and audiovisual works, subject to the following terms:
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
                (a) Compositions, Stems, Multi-Kits, Construction Kits, and Drum Breaks ("Master Use Materials")
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Licensee may incorporate these Materials into new musical works for commercial release, placement, or synchronization.</li>
                <li>Licensee must give credit on derivative works to the named Creator(s) as "Producer," "Co-Producer," or "Contains sample(s) by [Creator(s)]" Ex: "Co-Prod by [Creator Name]"; the creator(s) name will be provided on every kit.</li>
                <li>Licensee must provide the Creator(s) a fair and equal publishing share/revenue split on resale of derivative works utilizing the materials (default: even share off associated advances, fees, writer's, and publisher's, split unless otherwise specified: contact samplesociety@gmail.com for Revenue Split/PRO information).</li>
                <li>Licensee must ensure that Creator(s) are properly registered with applicable performing rights organizations (PROs) for all distributed works containing these Materials.</li>
                <li>These Materials are not royalty-free; they require proper attribution and publishing participation.</li>
                <li>In case of placement using the sample(s), you will split the publishing, royalties, mechanicals, points & advance fees with the Creator(s) fairly and Production (or Co-Production) or sample attribution must be credited to the Creator(s).</li>
              </ul>

              <h4 className="text-lg font-semibold text-foreground mt-6 mb-3">
                (b) One-Shots, Midi-Kits, and Sound Banks ("Royalty-Free Materials")
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Licensee may freely use individual sounds, drum hits, FX, Midi, or other one-shot samples in new compositions without credit, royalties, or publishing splits.</li>
                <li>Royalty-Free Materials may not be resold, redistributed, or included in new sample packs, libraries, or virtual instruments.</li>
                <li>Licensee owns full creative rights to works incorporating these sounds, subject only to the restriction above.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">2. RESTRICTIONS</h3>
              <p className="text-foreground mb-2">Licensee may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Resell, share, or redistribute the Materials (in whole or in part) as standalone content or as part of any other sample library or sound pack.</li>
                <li>Claim full ownership/authorship of the original Materials, stems, or compositions.</li>
                <li>Use the name "Sample Society" or the Creator's name in a misleading way that implies endorsement beyond proper credit.</li>
                <li>Use samples in isolation as standalone tracks without additional creative input.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">3. RIGHTS AND OWNERSHIP</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All copyrights in and to the original Materials remain the sole property of Sample Society and the individual Creator(s).</li>
                <li>This license grants use rights only; it does not transfer ownership.</li>
                <li>Licensee owns only the newly created derivative work, subject to the publishing and credit obligations for Master Use Materials.</li>
                <li>Creators retain their full master and publishing interests in their original works.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">4. ROYALTIES, CREDIT, AND REGISTRATION</h3>
              
              <h4 className="text-lg font-semibold text-foreground mt-4 mb-3">
                For Compositions, Stems, and Drum Breaks:
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Licensee must credit the Creator(s) in all public releases (e.g., "Prod. [Creator Name]" or "Contains sample(s) by [Creator Name] via Sample Society").</li>
                <li>Licensee must honor agreed publishing splits (fair/even default 50% writer and 50% publisher split).</li>
                <li>Licensee shall provide publishing registration details and/or release metadata to Sample Society or the Creator(s) upon request.</li>
                <li>If the derived work is commercially released or placed (sync, label, film, etc.), Licensee must ensure Creator(s) are credited and compensated accordingly equivalent to the terms of use.</li>
              </ul>

              <h4 className="text-lg font-semibold text-foreground mt-4 mb-3">
                For One-Shots and Sound Banks:
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>No royalties, credit, or registration is required.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">5. REPRESENTATIONS AND WARRANTIES</h3>
              
              <p className="text-foreground mb-2">Sample Society and its Creators warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>The Materials are original and owned or properly licensed.</li>
                <li>The Materials do not knowingly infringe upon any third-party rights.</li>
              </ul>

              <p className="text-foreground mb-2">Licensee warrants that:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>They will use the Materials only as permitted herein.</li>
                <li>They will not misrepresent ownership or authorship of the underlying Materials.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">6. TERM AND TERRITORY</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>This Agreement is effective immediately upon purchase or download and remains in effect for the life of the copyright & any derivative works.</li>
                <li>This license applies worldwide, for all media and distribution channels now known or hereafter developed.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">7. ACCOUNTING AND VERIFICATION</h3>
              <p className="text-muted-foreground">
                Sample Society and/or the Creator(s) may request reasonable verification of earnings, credit, publishing registration, or royalty arrangements for any commercially released work using Master Use Materials. Licensee agrees to provide such verification upon request.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">8. GOVERNING LAW</h3>
              <p className="text-muted-foreground">
                This Agreement shall be governed by and construed in accordance with the laws of the State of Illinois, without regard to its conflict-of-law provisions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">9. ENTIRE AGREEMENT</h3>
              <p className="text-muted-foreground">
                This Agreement constitutes the full understanding between the parties regarding the Materials. If any provision is deemed invalid or unenforceable, the remainder shall remain in full force and effect.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">10. REFUND POLICY</h3>
              <p className="text-muted-foreground">
                Due to the digital nature of these products, all sales are final. Please listen to any available previews before purchasing. If you experience technical issues with your download, please contact us for support.
              </p>
            </div>

            <div className="border-t border-border pt-8 mt-8">
              <p className="text-lg font-bold text-primary">SAMPLE SOCIETY</p>
              <p className="text-muted-foreground mt-2">
                Representing its affiliated creators and producers
              </p>
              <p className="text-muted-foreground mt-1 italic">
                Effective immediately upon purchase or download of product.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
