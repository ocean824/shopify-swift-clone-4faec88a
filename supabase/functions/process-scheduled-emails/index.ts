import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function is meant to be called on a schedule (e.g., every 15 minutes via n8n)
// It checks for emails that are due to be sent and triggers them

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find all active sequences with emails due
    const now = new Date().toISOString();
    
    const { data: dueEmails, error } = await supabase
      .from("email_sequence_progress")
      .select(`
        id,
        subscriber_id,
        sequence_name,
        current_step,
        next_email_scheduled_at,
        email_subscribers!inner(id, email, first_name, is_active)
      `)
      .eq("is_active", true)
      .lte("next_email_scheduled_at", now)
      .limit(50);

    if (error) {
      throw error;
    }

    console.log(`Found ${dueEmails?.length || 0} emails due to send`);

    const results = [];
    
    for (const emailJob of dueEmails || []) {
      // Skip inactive subscribers
      if (!emailJob.email_subscribers?.is_active) {
        continue;
      }

      try {
        // Call the send-sequence-email function
        const sendUrl = `${supabaseUrl}/functions/v1/send-sequence-email`;
        const response = await fetch(sendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            subscriber_id: emailJob.subscriber_id,
            sequence_name: emailJob.sequence_name,
            step: emailJob.current_step,
            force: true, // We already checked the schedule
          }),
        });

        const result = await response.json();
        results.push({
          subscriber_id: emailJob.subscriber_id,
          sequence: emailJob.sequence_name,
          step: emailJob.current_step,
          ...result,
        });

      } catch (sendError) {
        console.error(`Failed to send email for ${emailJob.subscriber_id}:`, sendError);
        results.push({
          subscriber_id: emailJob.subscriber_id,
          sequence: emailJob.sequence_name,
          error: sendError.message,
        });
      }
    }

    // Also check for dormant subscribers (no activity in 60+ days)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: dormantSubscribers } = await supabase
      .from("email_subscribers")
      .select("id, email")
      .eq("is_active", true)
      .not("segment", "eq", "pantheon_member")
      .lt("updated_at", sixtyDaysAgo)
      .not("id", "in", `(
        SELECT subscriber_id FROM email_sequence_progress 
        WHERE sequence_name = 'dormant_winback' AND is_active = true
      )`)
      .limit(10);

    // Start dormant winback sequences
    for (const dormant of dormantSubscribers || []) {
      await supabase
        .from("email_subscribers")
        .update({ segment: "dormant" })
        .eq("id", dormant.id);

      await supabase
        .from("email_sequence_progress")
        .insert({
          subscriber_id: dormant.id,
          sequence_name: "dormant_winback",
          current_step: 0,
          next_email_scheduled_at: new Date().toISOString(),
        });

      console.log(`Started dormant winback for ${dormant.email}`);
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      dormant_started: dormantSubscribers?.length || 0,
      results,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Process scheduled emails error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});