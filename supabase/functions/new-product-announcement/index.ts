import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-shopify-topic, x-shopify-hmac-sha256",
};

// Sample Society brand voice for captions
const CAPTION_TEMPLATES = {
  sample_kit: [
    "🔥 NEW DROP: {{title}}\n\n{{description}}\n\nThese sounds hit DIFFERENT. Grab yours before they're gone.\n\n💰 {{price}}\n🔗 Link in bio\n\n#producer #beatmaker #samplepack #musicproducer #beats #hiphop #rnb #trapbeats #typebeat",
    "Just dropped something crazy... 🎹\n\n{{title}} is OUT NOW.\n\n{{description}}\n\nProducers who know, know. 🔥\n\n💰 {{price}} | Link in bio\n\n#producerlife #beatmaking #samples #loops #musicproduction",
    "The wait is over. 💿\n\n{{title}}\n\n{{description}}\n\nEvery sound is handcrafted. No filler. Just heat.\n\n{{price}} → Link in bio\n\n#newmusic #producer #samplesociety #soundkit #melodies",
  ],
  midi_kit: [
    "🎹 MIDI ALERT: {{title}}\n\n{{description}}\n\nPlug these progressions straight into your DAW.\n\n💰 {{price}}\n🔗 Link in bio\n\n#midi #chords #melodies #producer #musictheory #beatmaker",
    "Need melodies? Say less. 🔑\n\n{{title}} just dropped.\n\n{{description}}\n\n{{price}} | Grab it → Link in bio\n\n#midipack #producer #chordprogressions #musicproducer",
  ],
  drum_kit: [
    "🥁 DRUMS JUST DROPPED: {{title}}\n\n{{description}}\n\nHard-hitting drums that cut through any mix.\n\n💰 {{price}}\n🔗 Link in bio\n\n#drums #drumkit #producer #808s #hihats #beats",
    "Your drums are about to hit different. 🔥\n\n{{title}} is here.\n\n{{description}}\n\n{{price}} → Link in bio\n\n#drumsamples #beatmaking #producer #trapdrums",
  ],
  bundle: [
    "🚨 BUNDLE DROP: {{title}}\n\n{{description}}\n\nThe complete toolkit. Everything you need.\n\n💰 {{price}} (HUGE savings)\n🔗 Link in bio\n\n#bundle #producer #samplepack #beatmaker #deal",
  ],
};

// Detect product type from title/description
function detectProductType(title: string, description: string): keyof typeof CAPTION_TEMPLATES {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  if (lowerTitle.includes("bundle") || lowerDesc.includes("bundle")) return "bundle";
  if (lowerTitle.includes("midi") || lowerDesc.includes("midi")) return "midi_kit";
  if (lowerTitle.includes("drum") || lowerTitle.includes("808") || lowerDesc.includes("drums")) return "drum_kit";
  return "sample_kit";
}

// Generate caption from template
function generateCaption(product: { title: string; description: string; price: string }): string {
  const productType = detectProductType(product.title, product.description);
  const templates = CAPTION_TEMPLATES[productType];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return template
    .replace(/\{\{title\}\}/g, product.title)
    .replace(/\{\{description\}\}/g, product.description.slice(0, 200) + (product.description.length > 200 ? "..." : ""))
    .replace(/\{\{price\}\}/g, product.price);
}

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  images: Array<{ src: string }>;
  variants: Array<{ price: string }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const shopifyTopic = req.headers.get("x-shopify-topic");
    const payload = await req.json();

    console.log(`New product announcement webhook: ${shopifyTopic}`);

    // Handle both direct calls and Shopify webhooks
    let product: {
      title: string;
      description: string;
      price: string;
      image_url: string;
      handle: string;
      shopify_id: string;
    };

    if (shopifyTopic === "products/create" || shopifyTopic === "products/update") {
      // Shopify webhook format
      const shopifyProduct = payload as ShopifyProduct;
      product = {
        title: shopifyProduct.title,
        description: shopifyProduct.body_html?.replace(/<[^>]*>/g, "") || "",
        price: `$${shopifyProduct.variants?.[0]?.price || "0"}`,
        image_url: shopifyProduct.images?.[0]?.src || "",
        handle: shopifyProduct.handle,
        shopify_id: shopifyProduct.id.toString(),
      };
    } else {
      // Direct API call format
      product = payload.product;
      if (!product) {
        throw new Error("product data required");
      }
    }

    // Generate caption
    const caption = generateCaption(product);

    // Store announcement for reference
    await supabase.from("shopify_webhook_log").insert({
      event_type: "product_announcement",
      shopify_id: product.shopify_id || product.handle,
      payload: {
        product,
        generated_caption: caption,
      },
      processed: false,
    });

    // Trigger n8n webhook if configured
    const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
    if (n8nWebhookUrl) {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "new_product",
          product,
          caption,
          manychat_payload: {
            action: "send_content",
            product: {
              title: product.title,
              price: product.price,
              image_url: product.image_url,
              handle: product.handle,
              description: product.description.slice(0, 500),
            },
          },
        }),
      });
    }

    // Return the generated content
    return new Response(JSON.stringify({
      success: true,
      product: {
        title: product.title,
        handle: product.handle,
        image_url: product.image_url,
      },
      generated_caption: caption,
      caption_length: caption.length,
      manychat_ready: {
        action: "send_content",
        product: {
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          handle: product.handle,
        },
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Product announcement error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});