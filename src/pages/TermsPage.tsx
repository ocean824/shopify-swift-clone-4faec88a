import { Layout } from '@/components/layout/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <section className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Master Use License Agreement
        </h1>
        <p className="mt-4 text-muted-foreground">
          Effective Date: January 1, 2024
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">1. Definitions</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li><strong className="text-foreground">"Master Use Materials"</strong> refers to Compositions and/or Stems purchased from Sample Society.</li>
              <li><strong className="text-foreground">"Royalty-Free Materials"</strong> refers to One-Shots, Drum Kits, and MIDI files purchased from Sample Society.</li>
              <li><strong className="text-foreground">"Licensee"</strong> refers to the purchaser of Sample Society products.</li>
              <li><strong className="text-foreground">"New Recording"</strong> refers to any musical work created using Sample Society materials.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">2. Grant of License - Master Use Materials</h2>
            <p className="mb-4">
              Sample Society grants Licensee a non-exclusive, non-transferable, worldwide license to use Master Use Materials (Compositions and Stems) in New Recordings, subject to the following conditions:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Licensee may use Master Use Materials in unlimited commercial and non-commercial projects.</li>
              <li>Licensee must provide writing credit to Sample Society in the format: "Contains samples from Sample Society"</li>
              <li>Master Use Materials may NOT be redistributed, resold, or shared in their original or modified form.</li>
              <li>Master Use Materials may NOT be used in any sample pack, loop kit, or similar product.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">3. Grant of License - Royalty-Free Materials</h2>
            <p className="mb-4">
              Sample Society grants Licensee a non-exclusive, non-transferable, worldwide, royalty-free license to use Royalty-Free Materials (One-Shots, Drum Kits, MIDI) in New Recordings:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Licensee may use Royalty-Free Materials in unlimited commercial and non-commercial projects.</li>
              <li>No credit or royalty payments are required for Royalty-Free Materials.</li>
              <li>Royalty-Free Materials may NOT be redistributed, resold, or shared in their original form.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">4. Restrictions</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Licensee may NOT claim ownership of any Sample Society materials.</li>
              <li>Licensee may NOT register any Sample Society materials with any content identification system (YouTube Content ID, etc.) in their original form.</li>
              <li>Licensee may NOT use Sample Society materials in any unlawful, defamatory, or obscene manner.</li>
              <li>Licensee may NOT transfer, sublicense, or assign this license to any third party.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">5. Ownership</h2>
            <p>
              Sample Society retains all ownership rights to the original materials. This license grants usage rights only and does not transfer ownership of any intellectual property.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">6. Credit Requirements</h2>
            <p className="mb-4">
              For Master Use Materials (Compositions/Stems), Licensee must provide credit in the following format:
            </p>
            <p className="rounded-lg bg-card p-4 font-mono text-foreground">
              "Contains samples from Sample Society"
            </p>
            <p className="mt-4">
              Credit should appear in liner notes, song descriptions, or wherever production credits are typically displayed.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">7. Refund Policy</h2>
            <p>
              Due to the digital nature of our products, all sales are final. No refunds will be issued after purchase and download. If you experience technical issues with your purchase, please contact us for assistance.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">8. Termination</h2>
            <p>
              This license is effective until terminated. Sample Society may terminate this license if Licensee fails to comply with any terms. Upon termination, Licensee must destroy all copies of Sample Society materials.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>
              Sample Society shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products. Our maximum liability shall not exceed the purchase price of the product.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">10. Governing Law</h2>
            <p>
              This agreement shall be governed by and construed in accordance with the laws of the United States. Any disputes shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <p className="text-center text-foreground">
              By purchasing and using Sample Society products, you acknowledge that you have read, understood, and agree to be bound by this Master Use License Agreement.
            </p>
          </section>
        </div>
      </section>
    </Layout>
  );
}
