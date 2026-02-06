import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function receives triggers from n8n and processes them
// n8n can call this to:
// 1. Manually trigger a sequence for a subscriber
// 2. Update subscriber segments
// 3. Fetch subscriber data
// 4. Send a specific email

interface N8NRequest {
  action: "start_sequence" | "send_email" | "update_segment" | "get_subscriber" | "list_due_emails";
  email?: string;
  subscriber_id?: string;
  sequence_name?: string;
  step?: number;
  segment?: string;
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

    const request: N8NRequest = await req.json();
    console.log("n8n trigger received:", request.action);

    switch (request.action) {
      case "start_sequence": {
        if (!request.email && !request.subscriber_id) {
          throw new Error("email or subscriber_id required");
        }
        if (!request.sequence_name) {
          throw new Error("sequence_name required");
        }

        // Get subscriber
        let subscriberId = request.subscriber_id;
        if (!subscriberId && request.email) {
          const { data: sub } = await supabase
            .from("email_subscribers")
            .select("id")
            .eq("email", request.email)
            .single();
          
          if (!sub) {
            // Create new subscriber
            const { data: newSub, error } = await supabase
              .from("email_subscribers")
              .insert({ email: request.email, segment: "cold_subscriber" })
              .select()
              .single();
            
            if (error) throw error;
            subscriberId = newSub.id;
          } else {
            subscriberId = sub.id;
          }
        }

        // Check if sequence already exists
        const { data: existing } = await supabase
          .from("email_sequence_progress")
          .select("id")
          .eq("subscriber_id", subscriberId)
          .eq("sequence_name", request.sequence_name)
          .eq("is_active", true)
          .single();

        if (existing) {
          return new Response(JSON.stringify({
            success: false,
            message: "Sequence already active for this subscriber",
          }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Start sequence
        const { error } = await supabase
          .from("email_sequence_progress")
          .insert({
            subscriber_id: subscriberId,
            sequence_name: request.sequence_name,
            current_step: 0,
            next_email_scheduled_at: new Date().toISOString(),
          });

        if (error) throw error;

        // Trigger first email immediately
        const sendUrl = `${supabaseUrl}/functions/v1/send-sequence-email`;
        await fetch(sendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            subscriber_id: subscriberId,
            sequence_name: request.sequence_name,
            step: 0,
            force: true,
          }),
        });

        return new Response(JSON.stringify({
          success: true,
          subscriber_id: subscriberId,
          sequence_name: request.sequence_name,
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "send_email": {
        if (!request.subscriber_id || !request.sequence_name || request.step === undefined) {
          throw new Error("subscriber_id, sequence_name, and step required");
        }

        const sendUrl = `${supabaseUrl}/functions/v1/send-sequence-email`;
        const response = await fetch(sendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            subscriber_id: request.subscriber_id,
            sequence_name: request.sequence_name,
            step: request.step,
            force: true,
          }),
        });

        const result = await response.json();
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update_segment": {
        if (!request.email && !request.subscriber_id) {
          throw new Error("email or subscriber_id required");
        }
        if (!request.segment) {
          throw new Error("segment required");
        }

        const updateData: Record<string, unknown> = { segment: request.segment };
        if (request.tags) {
          updateData.tags = request.tags;
        }

        const query = supabase.from("email_subscribers").update(updateData);
        
        if (request.subscriber_id) {
          query.eq("id", request.subscriber_id);
        } else {
          query.eq("email", request.email);
        }

        const { error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_subscriber": {
        if (!request.email && !request.subscriber_id) {
          throw new Error("email or subscriber_id required");
        }

        const query = supabase.from("email_subscribers").select(`
          *,
          email_sequence_progress(*)
        `);

        if (request.subscriber_id) {
          query.eq("id", request.subscriber_id);
        } else {
          query.eq("email", request.email);
        }

        const { data, error } = await query.single();
        if (error) throw error;

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_due_emails": {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
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
          .limit(100);

        if (error) throw error;

        return new Response(JSON.stringify({
          count: data?.length || 0,
          emails: data,
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

  } catch (error) {
    console.error("n8n trigger error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});