import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  subscriber_id: string;
  sequence_name: string;
  step: number;
  force?: boolean; // Skip delay check
}

// Default email templates for each sequence step
const DEFAULT_TEMPLATES: Record<string, Array<{
  subject: string;
  delay_hours: number;
  email_type: string;
  html: (firstName: string) => string;
}>> = {
  welcome_sequence: [
    {
      subject: "🎹 Welcome to Sample Society + Your Free Pack",
      delay_hours: 0,
      email_type: "value",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Welcome to the Society, ${firstName || "Producer"}! 🎹</h1>
          <p>You just joined a community of producers who are serious about their craft.</p>
          <p><strong>Here's your free sample pack as promised:</strong></p>
          <a href="https://samplesociety.lovable.app/free-pack" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Download Free Pack</a>
          <p>Over the next few days, I'll share:</p>
          <ul>
            <li>Production tips that actually move the needle</li>
            <li>How to get the most out of your samples</li>
            <li>Exclusive deals you won't find anywhere else</li>
          </ul>
          <p>Talk soon,<br/>The Sample Society Team</p>
        </div>
      `,
    },
    {
      subject: "Quick win: The 808 trick that changed everything",
      delay_hours: 48,
      email_type: "authority",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Hey ${firstName || "there"}, quick tip for you</h1>
          <p>Most producers layer their 808s wrong.</p>
          <p>They stack frequencies that fight each other. The result? Muddy low end that sounds like a washing machine.</p>
          <p><strong>Here's what actually works:</strong></p>
          <ol>
            <li>Your main 808 handles the sub (20-80Hz)</li>
            <li>Layer a short, punchy kick for attack (80-200Hz)</li>
            <li>Cut everything below 30Hz on both</li>
          </ol>
          <p>Simple, but most people overcomplicate it.</p>
          <p>Try it on your next beat and let me know how it goes.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "Why we started Sample Society (real talk)",
      delay_hours: 96,
      email_type: "story",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Hey"}, here's our story</h1>
          <p>We started Sample Society because we were tired of:</p>
          <ul>
            <li>Sample packs with 500 sounds and 5 usable ones</li>
            <li>Loops that sound dated the moment you download them</li>
            <li>Paying premium prices for recycled content</li>
          </ul>
          <p>So we built something different.</p>
          <p>Every sound in our kits is handcrafted. Every melody is original. Every drum is processed to sit perfectly in a mix.</p>
          <p>No filler. No fluff. Just sounds that make producers say "where did you get THAT?"</p>
          <p>That's the standard. Nothing less.</p>
          <p>— The Sample Society Team</p>
        </div>
      `,
    },
    {
      subject: "🎁 Free workflow template (steal this)",
      delay_hours: 168,
      email_type: "value",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Producer"}, grab this free template</h1>
          <p>I put together a workflow template that helps you finish beats 2x faster.</p>
          <p>It's the exact process I use when I'm in the zone:</p>
          <ul>
            <li>✓ Pre-routed mixer channels</li>
            <li>✓ Essential plugins already loaded</li>
            <li>✓ Color-coded tracks for instant navigation</li>
          </ul>
          <a href="https://samplesociety.lovable.app/free-template" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Download Template</a>
          <p>Use it, modify it, make it yours.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "Your first kit: 40% off (24 hours only)",
      delay_hours: 240,
      email_type: "soft_pitch",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Ready to level up, ${firstName || "Producer"}?</h1>
          <p>You've been on the list for 10 days now. You've seen what we're about.</p>
          <p>If you're ready to grab your first kit, here's a welcome gift:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">40% OFF Any Kit</h2>
            <p style="font-size: 24px; font-weight: bold; color: #000;">Code: WELCOME40</p>
            <p style="color: #666; margin-bottom: 0;">Expires in 24 hours</p>
          </div>
          <a href="https://samplesociety.lovable.app" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Browse Kits</a>
          <p style="margin-top: 20px;">— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "Last chance: Your 40% code expires tonight",
      delay_hours: 264,
      email_type: "hard_pitch",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">⏰ ${firstName || "Hey"}, your code expires at midnight</h1>
          <p>Just a heads up — your WELCOME40 code disappears tonight.</p>
          <p>After that, it's back to full price.</p>
          <a href="https://samplesociety.lovable.app" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Use Code Before Midnight</a>
          <p>No pressure. But if you've been eyeing something, now's the time.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
  ],
  post_purchase_sequence: [
    {
      subject: "Your kit is ready — here's how to use it",
      delay_hours: 0,
      email_type: "value",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Thanks for your order, ${firstName || "Producer"}! 🔥</h1>
          <p>Your download is ready. But before you dive in...</p>
          <p><strong>Quick tips to get the most out of your new sounds:</strong></p>
          <ol>
            <li>Listen through everything once before using</li>
            <li>Create a favorites folder for your go-to sounds</li>
            <li>Layer 2-3 sounds together for unique textures</li>
          </ol>
          <a href="https://samplesociety.lovable.app/downloads" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Access Downloads</a>
          <p>Happy producing!</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "Advanced technique: Stack these sounds together",
      delay_hours: 72,
      email_type: "authority",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Hey"}, try this layering trick</h1>
          <p>Now that you have your kit, here's how to make it sound 10x better:</p>
          <p><strong>The Stack Method:</strong></p>
          <ul>
            <li>Take any melody loop</li>
            <li>Duplicate it and pitch one up 12 semitones</li>
            <li>Add a slight delay (20-50ms) to the octave layer</li>
            <li>Lower the volume of the octave by 6-8dB</li>
          </ul>
          <p>Instant thickness. Instant vibe. Works every time.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "🎁 Bonus content unlocked (exclusive)",
      delay_hours: 120,
      email_type: "value",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Producer"}, you unlocked bonus content</h1>
          <p>As a thank you for your purchase, I'm giving you access to our bonus vault:</p>
          <ul>
            <li>5 unreleased loops</li>
            <li>Mixing presets from recent sessions</li>
            <li>A 15-minute walkthrough video</li>
          </ul>
          <a href="https://samplesociety.lovable.app/bonus" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Access Bonus Vault</a>
          <p>Enjoy!</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "These kits pair perfectly with yours",
      delay_hours: 240,
      email_type: "soft_pitch",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Hey"}, found some matches for you</h1>
          <p>Based on what you bought, these kits would complement your sound:</p>
          <p>They're designed to layer together seamlessly. Same key ranges, similar vibes, different textures.</p>
          <a href="https://samplesociety.lovable.app" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">See Recommendations</a>
          <p>No rush — just thought you'd want to know.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "The bundle deal (save 60%)",
      delay_hours: 336,
      email_type: "offer",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Producer"}, ever considered the bundle?</h1>
          <p>Since you already own one of our kits, I wanted to let you know about the All Kits Bundle.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">All Kits Bundle</h2>
            <ul>
              <li>Every sample kit we've ever made</li>
              <li>Every kit we release this year</li>
              <li>60% off individual pricing</li>
            </ul>
          </div>
          <a href="https://samplesociety.lovable.app/bundle" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Learn More</a>
          <p>— Sample Society</p>
        </div>
      `,
    },
  ],
  ascension_sequence: [
    {
      subject: "You're in the top 10% of our community",
      delay_hours: 0,
      email_type: "authority",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Producer"}, you're in rare company 🏆</h1>
          <p>Most people download a free pack and disappear.</p>
          <p>You? You've invested in multiple kits. You're serious about your craft.</p>
          <p>That puts you in the top 10% of our community.</p>
          <p>I want to make sure you're getting the absolute most out of your sounds. Reply to this email and let me know:</p>
          <ul>
            <li>What genre are you focusing on?</li>
            <li>What's your biggest production challenge right now?</li>
          </ul>
          <p>I read every reply.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "Exclusive bundle offer (not public)",
      delay_hours: 72,
      email_type: "offer",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Hey"}, got something for you</h1>
          <p>Since you're one of our most active members, I'm offering you early access to something we're not promoting publicly yet.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">VIP Bundle Upgrade</h2>
            <p>Complete your collection at 50% off.</p>
            <p style="font-size: 24px; font-weight: bold; color: #000;">Code: VIP50</p>
          </div>
          <a href="https://samplesociety.lovable.app/bundle" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Claim VIP Offer</a>
          <p>This won't be shared anywhere else.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "The Pantheon (lifetime access explained)",
      delay_hours: 168,
      email_type: "ascension",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Producer"}, ever heard of The Pantheon?</h1>
          <p>It's our lifetime membership. One payment, everything forever.</p>
          <p><strong>What you get:</strong></p>
          <ul>
            <li>Every kit we've ever made</li>
            <li>Every kit we ever will make</li>
            <li>Monthly exclusive drops</li>
            <li>Direct access to our production team</li>
            <li>Early access to everything</li>
          </ul>
          <p>It's for producers who want to never think about sounds again. Just create.</p>
          <p>If that sounds like you, reply "Pantheon" and I'll send you the details.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "Pantheon: Limited spots available",
      delay_hours: 336,
      email_type: "hard_pitch",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Hey"}, quick update on The Pantheon</h1>
          <p>We're capping Pantheon membership at 100 members this year.</p>
          <p>Currently at 73/100.</p>
          <p>If you've been considering it, this is your window. Once we hit 100, we're closing enrollment until next year.</p>
          <a href="https://samplesociety.lovable.app/pantheon" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Join The Pantheon</a>
          <p>— Sample Society</p>
        </div>
      `,
    },
  ],
  dormant_winback: [
    {
      subject: "You still making beats?",
      delay_hours: 0,
      email_type: "reactivation",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Hey ${firstName || "there"}...</h1>
          <p>Haven't seen you around in a while.</p>
          <p>No pitch, no offer. Just checking in.</p>
          <p>You still producing?</p>
          <p>Hit reply and let me know what you're working on. I'd genuinely love to hear.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "🎁 A gift to get you back in the studio",
      delay_hours: 72,
      email_type: "value",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Producer"}, here's something free</h1>
          <p>I know life gets busy. The studio takes a backseat sometimes.</p>
          <p>Here's a free mini-pack to help you get back in the zone:</p>
          <a href="https://samplesociety.lovable.app/comeback-pack" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Download Free Pack</a>
          <p>No strings attached. Just wanted to give you a spark.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "We miss having you around",
      delay_hours: 168,
      email_type: "story",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Hey"}, real talk</h1>
          <p>I know what it's like to fall off.</p>
          <p>You open your DAW, stare at the screen, and nothing comes. So you close it and tell yourself "tomorrow."</p>
          <p>Then tomorrow becomes next week. Next month.</p>
          <p>But here's the thing: the hardest part is just opening the project. Once you're in, the ideas flow.</p>
          <p>Open your DAW tonight. Just for 10 minutes. See what happens.</p>
          <p>I'm rooting for you.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "50% off to welcome you back",
      delay_hours: 336,
      email_type: "hard_pitch",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">${firstName || "Producer"}, comeback deal inside</h1>
          <p>If you've been waiting for the right moment to dive back in, this is it.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">50% Off Any Kit</h2>
            <p style="font-size: 24px; font-weight: bold; color: #000;">Code: COMEBACK50</p>
            <p style="color: #666; margin-bottom: 0;">Valid for 7 days</p>
          </div>
          <a href="https://samplesociety.lovable.app" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Browse Kits</a>
          <p>No pressure. But the door's open.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
    {
      subject: "Should we part ways?",
      delay_hours: 504,
      email_type: "reactivation",
      html: (firstName) => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Last email from me, ${firstName || "friend"}</h1>
          <p>I don't want to clog your inbox if you're not interested anymore.</p>
          <p>If you want to stay on the list, just click below and I'll keep you in the loop:</p>
          <a href="https://samplesociety.lovable.app/stay-subscribed" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Yes, Keep Me Subscribed</a>
          <p>If I don't hear from you, I'll remove you from the list in 7 days. No hard feelings.</p>
          <p>Thanks for being part of the journey.</p>
          <p>— Sample Society</p>
        </div>
      `,
    },
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { subscriber_id, sequence_name, step, force = false }: SendEmailRequest = await req.json();

    // Get subscriber info
    const { data: subscriber, error: subError } = await supabase
      .from("email_subscribers")
      .select("*")
      .eq("id", subscriber_id)
      .single();

    if (subError || !subscriber) {
      throw new Error("Subscriber not found");
    }

    if (!subscriber.is_active) {
      return new Response(JSON.stringify({ success: false, message: "Subscriber is inactive" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get sequence progress
    const { data: progress } = await supabase
      .from("email_sequence_progress")
      .select("*")
      .eq("subscriber_id", subscriber_id)
      .eq("sequence_name", sequence_name)
      .single();

    if (!progress || !progress.is_active) {
      return new Response(JSON.stringify({ success: false, message: "Sequence not active for subscriber" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get template - first try database, then fall back to defaults
    let template;
    const { data: dbTemplate } = await supabase
      .from("email_templates")
      .select("*")
      .eq("sequence_name", sequence_name)
      .eq("step_number", step)
      .eq("is_active", true)
      .single();

    if (dbTemplate) {
      template = {
        subject: dbTemplate.subject,
        html: dbTemplate.html_content.replace(/\{\{first_name\}\}/g, subscriber.first_name || "Producer"),
        delay_hours: dbTemplate.delay_hours,
        email_type: dbTemplate.email_type,
      };
    } else {
      // Use default templates
      const defaultSeq = DEFAULT_TEMPLATES[sequence_name];
      if (!defaultSeq || !defaultSeq[step]) {
        // Sequence complete
        await supabase
          .from("email_sequence_progress")
          .update({ completed_at: new Date().toISOString(), is_active: false })
          .eq("id", progress.id);

        return new Response(JSON.stringify({ success: true, message: "Sequence completed" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const defaultTemplate = defaultSeq[step];
      template = {
        subject: defaultTemplate.subject,
        html: defaultTemplate.html(subscriber.first_name),
        delay_hours: defaultTemplate.delay_hours,
        email_type: defaultTemplate.email_type,
      };
    }

    // Check if we should send (delay has passed) unless forced
    if (!force && step > 0) {
      const lastSent = progress.last_email_sent_at ? new Date(progress.last_email_sent_at) : new Date(progress.started_at);
      const hoursSinceLastEmail = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastEmail < template.delay_hours) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: "Delay not met",
          hours_remaining: template.delay_hours - hoursSinceLastEmail
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Sample Society <hello@samplesociety.com>", // Replace with verified domain
      to: [subscriber.email],
      subject: template.subject,
      html: template.html,
    });

    console.log("Email sent:", emailResponse);

    // Log the send
    await supabase.from("email_send_log").insert({
      subscriber_id: subscriber.id,
      email_to: subscriber.email,
      sequence_name,
      email_type: template.email_type,
      subject: template.subject,
      resend_id: emailResponse.data?.id,
      status: "sent",
    });

    // Update sequence progress
    const nextStep = step + 1;
    const nextTemplate = DEFAULT_TEMPLATES[sequence_name]?.[nextStep];
    const nextScheduled = nextTemplate 
      ? new Date(Date.now() + nextTemplate.delay_hours * 60 * 60 * 1000).toISOString()
      : null;

    await supabase
      .from("email_sequence_progress")
      .update({
        current_step: nextStep,
        last_email_sent_at: new Date().toISOString(),
        next_email_scheduled_at: nextScheduled,
        completed_at: nextTemplate ? null : new Date().toISOString(),
        is_active: !!nextTemplate,
      })
      .eq("id", progress.id);

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailResponse.data?.id,
      next_step: nextTemplate ? nextStep : null,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Send sequence email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});