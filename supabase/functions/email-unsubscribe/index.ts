import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const email = url.searchParams.get("email") || (await req.json().catch(() => ({}))).email;

    if (!email) {
      throw new Error("Email is required");
    }

    // Find subscriber
    const { data: subscriber } = await supabase
      .from("email_subscribers")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (!subscriber) {
      return new Response(JSON.stringify({
        success: true,
        message: "Email not found in our list.",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark as unsubscribed
    await supabase
      .from("email_subscribers")
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id);

    // Deactivate all sequences
    await supabase
      .from("email_sequence_progress")
      .update({ is_active: false })
      .eq("subscriber_id", subscriber.id);

    // Log the unsubscribe
    await supabase.from("email_send_log").insert({
      subscriber_id: subscriber.id,
      email_to: email,
      email_type: "unsubscribe",
      subject: "Unsubscribed",
      status: "unsubscribed",
    });

    // If this is a GET request (clicked unsubscribe link), return HTML
    if (req.method === "GET") {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribed - Sample Society</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              h1 { color: #1a1a1a; }
              p { color: #666; }
              a { color: #000; }
            </style>
          </head>
          <body>
            <h1>You've been unsubscribed</h1>
            <p>We're sorry to see you go. You won't receive any more emails from Sample Society.</p>
            <p>Changed your mind? <a href="https://samplesociety.lovable.app/subscribe">Re-subscribe here</a></p>
          </body>
        </html>
      `;
      return new Response(html, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "You've been unsubscribed. We're sorry to see you go!",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Email unsubscribe error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});