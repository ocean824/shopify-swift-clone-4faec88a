import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-shopify-topic, x-shopify-hmac-sha256, x-shopify-shop-domain",
};

interface ShopifyCustomer {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  orders_count?: number;
  total_spent?: string;
}

interface ShopifyOrder {
  id: number;
  email: string;
  customer?: ShopifyCustomer;
  total_price: string;
  line_items?: Array<{ product_id: number; title: string }>;
  created_at: string;
}

// Segment determination based on order count
function determineSegment(orderCount: number): string {
  if (orderCount === 0) return "cold_subscriber";
  if (orderCount === 1) return "first_time_buyer";
  if (orderCount >= 2 && orderCount <= 4) return "repeat_buyer";
  return "power_buyer";
}

// Determine which sequence to start based on event
function getSequenceForEvent(eventType: string, segment: string): string | null {
  switch (eventType) {
    case "customers/create":
      return "welcome_sequence";
    case "orders/create":
      if (segment === "first_time_buyer") return "post_purchase_sequence";
      if (segment === "repeat_buyer") return "ascension_sequence";
      return null;
    default:
      return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const shopifyTopic = req.headers.get("x-shopify-topic") || "unknown";
    const payload = await req.json();

    console.log(`Received Shopify webhook: ${shopifyTopic}`);

    // Log the webhook event
    await supabase.from("shopify_webhook_log").insert({
      event_type: shopifyTopic,
      shopify_id: payload.id?.toString(),
      payload,
      processed: false,
    });

    let subscriberEmail = "";
    let subscriberData: Partial<{
      email: string;
      shopify_customer_id: string;
      first_name: string;
      last_name: string;
      total_orders: number;
      total_spent: number;
      last_order_at: string;
      segment: string;
    }> = {};

    // Handle different webhook types
    switch (shopifyTopic) {
      case "customers/create":
      case "customers/update": {
        const customer = payload as ShopifyCustomer;
        subscriberEmail = customer.email;
        const orderCount = customer.orders_count || 0;
        subscriberData = {
          email: customer.email,
          shopify_customer_id: customer.id.toString(),
          first_name: customer.first_name || "",
          last_name: customer.last_name || "",
          total_orders: orderCount,
          total_spent: parseFloat(customer.total_spent || "0"),
          segment: determineSegment(orderCount),
        };
        break;
      }

      case "orders/create":
      case "orders/paid": {
        const order = payload as ShopifyOrder;
        subscriberEmail = order.email;
        
        // Get existing subscriber to update order count
        const { data: existingSub } = await supabase
          .from("email_subscribers")
          .select("total_orders, total_spent")
          .eq("email", order.email)
          .single();

        const newOrderCount = (existingSub?.total_orders || 0) + 1;
        const newTotalSpent = (existingSub?.total_spent || 0) + parseFloat(order.total_price);

        subscriberData = {
          email: order.email,
          shopify_customer_id: order.customer?.id?.toString(),
          first_name: order.customer?.first_name || "",
          last_name: order.customer?.last_name || "",
          total_orders: newOrderCount,
          total_spent: newTotalSpent,
          last_order_at: order.created_at,
          segment: determineSegment(newOrderCount),
        };
        break;
      }

      default:
        console.log(`Unhandled webhook type: ${shopifyTopic}`);
        return new Response(JSON.stringify({ success: true, message: "Webhook received but not processed" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (!subscriberEmail) {
      throw new Error("No email found in webhook payload");
    }

    // Upsert subscriber
    const { data: subscriber, error: subError } = await supabase
      .from("email_subscribers")
      .upsert(subscriberData, { onConflict: "email" })
      .select()
      .single();

    if (subError) {
      console.error("Error upserting subscriber:", subError);
      throw subError;
    }

    // Determine if we should start a new sequence
    const sequenceName = getSequenceForEvent(shopifyTopic, subscriber.segment);
    
    if (sequenceName) {
      // Check if sequence already exists for this subscriber
      const { data: existingProgress } = await supabase
        .from("email_sequence_progress")
        .select("id")
        .eq("subscriber_id", subscriber.id)
        .eq("sequence_name", sequenceName)
        .single();

      if (!existingProgress) {
        // Start new sequence
        const { error: progressError } = await supabase
          .from("email_sequence_progress")
          .insert({
            subscriber_id: subscriber.id,
            sequence_name: sequenceName,
            current_step: 0,
            next_email_scheduled_at: new Date().toISOString(), // Send first email immediately
          });

        if (progressError) {
          console.error("Error creating sequence progress:", progressError);
        } else {
          console.log(`Started ${sequenceName} for ${subscriberEmail}`);

          // Trigger n8n workflow for immediate first email
          const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
          if (n8nWebhookUrl) {
            await fetch(n8nWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event: "sequence_start",
                subscriber,
                sequence_name: sequenceName,
                step: 0,
              }),
            });
          }
        }
      }
    }

    // Mark webhook as processed
    await supabase
      .from("shopify_webhook_log")
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq("shopify_id", payload.id?.toString())
      .eq("event_type", shopifyTopic);

    return new Response(JSON.stringify({ success: true, subscriber_id: subscriber.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Shopify webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});