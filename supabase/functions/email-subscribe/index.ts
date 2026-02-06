import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  first_name?: string;
  source?: string; // Where they signed up (homepage, popup, footer, etc.)
  tags?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, first_name, source, tags }: SubscribeRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from("email_subscribers")
      .select("id, is_active")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      if (!existing.is_active) {
        // Reactivate
        await supabase
          .from("email_subscribers")
          .update({ 
            is_active: true, 
            unsubscribed_at: null,
            tags: tags || [],
          })
          .eq("id", existing.id);

        // Restart welcome sequence
        await supabase
          .from("email_sequence_progress")
          .insert({
            subscriber_id: existing.id,
            sequence_name: "welcome_sequence",
            current_step: 0,
            next_email_scheduled_at: new Date().toISOString(),
          });

        // Trigger first email
        const sendUrl = `${supabaseUrl}/functions/v1/send-sequence-email`;
        await fetch(sendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            subscriber_id: existing.id,
            sequence_name: "welcome_sequence",
            step: 0,
            force: true,
          }),
        });

        return new Response(JSON.stringify({
          success: true,
          message: "Welcome back! We've reactivated your subscription.",
          subscriber_id: existing.id,
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: "You're already subscribed!",
        subscriber_id: existing.id,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create new subscriber
    const { data: newSubscriber, error: insertError } = await supabase
      .from("email_subscribers")
      .insert({
        email: email.toLowerCase(),
        first_name: first_name || null,
        segment: "cold_subscriber",
        tags: [...(tags || []), source || "website"].filter(Boolean),
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Start welcome sequence
    await supabase
      .from("email_sequence_progress")
      .insert({
        subscriber_id: newSubscriber.id,
        sequence_name: "welcome_sequence",
        current_step: 0,
        next_email_scheduled_at: new Date().toISOString(),
      });

    // Trigger first email immediately
    const sendUrl = `${supabaseUrl}/functions/v1/send-sequence-email`;
    await fetch(sendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        subscriber_id: newSubscriber.id,
        sequence_name: "welcome_sequence",
        step: 0,
        force: true,
      }),
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Welcome to Sample Society! Check your inbox for your free pack.",
      subscriber_id: newSubscriber.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Email subscribe error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});