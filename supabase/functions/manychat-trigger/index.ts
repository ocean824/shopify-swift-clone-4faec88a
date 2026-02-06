import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ManyChatRequest {
  action: "send_flow" | "send_content" | "set_custom_field" | "add_tag";
  subscriber_id?: string;
  flow_ns?: string; // Flow namespace for triggering a specific flow
  field_name?: string;
  field_value?: string;
  tag_name?: string;
  // For broadcast to all subscribers with a tag
  broadcast_to_tag?: string;
  // Product data for dynamic content
  product?: {
    title: string;
    price: string;
    image_url: string;
    handle: string;
    description?: string;
  };
}

// ManyChat API base URL
const MANYCHAT_API_BASE = "https://api.manychat.com/fb";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("MANYCHAT_API_KEY");
    if (!apiKey) {
      throw new Error("MANYCHAT_API_KEY is not configured");
    }

    const request: ManyChatRequest = await req.json();
    console.log("ManyChat trigger received:", request.action);

    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    let result;

    switch (request.action) {
      case "send_flow": {
        // Trigger a flow for a specific subscriber or broadcast
        if (request.subscriber_id && request.flow_ns) {
          // Send to specific subscriber
          const response = await fetch(`${MANYCHAT_API_BASE}/sending/sendFlow`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              subscriber_id: request.subscriber_id,
              flow_ns: request.flow_ns,
            }),
          });
          result = await response.json();
        } else if (request.broadcast_to_tag && request.flow_ns) {
          // Get subscribers with tag and send to each
          // Note: ManyChat doesn't have a direct "broadcast to tag" API,
          // so this would need to be done via their Broadcasting feature
          // or by iterating through tagged subscribers
          result = { 
            success: false, 
            message: "Use ManyChat Broadcasting for bulk sends. Set up a flow triggered by custom field update instead." 
          };
        } else {
          throw new Error("subscriber_id + flow_ns OR broadcast_to_tag + flow_ns required");
        }
        break;
      }

      case "send_content": {
        // Send dynamic content (for product announcements)
        if (!request.subscriber_id || !request.product) {
          throw new Error("subscriber_id and product required for send_content");
        }

        // Send a dynamic message with product info
        const messageContent = {
          subscriber_id: request.subscriber_id,
          data: {
            version: "v2",
            content: {
              messages: [
                {
                  type: "image",
                  url: request.product.image_url,
                },
                {
                  type: "text",
                  text: `🔥 NEW DROP: ${request.product.title}\n\n${request.product.description || ""}\n\n💰 ${request.product.price}\n\n👇 Get it now:`,
                },
                {
                  type: "text",
                  text: `https://samplesociety.lovable.app/product/${request.product.handle}`,
                  buttons: [
                    {
                      type: "url",
                      caption: "🛒 Shop Now",
                      url: `https://samplesociety.lovable.app/product/${request.product.handle}`,
                    },
                  ],
                },
              ],
            },
          },
        };

        const response = await fetch(`${MANYCHAT_API_BASE}/sending/sendContent`, {
          method: "POST",
          headers,
          body: JSON.stringify(messageContent),
        });
        result = await response.json();
        break;
      }

      case "set_custom_field": {
        // Set a custom field (useful for triggering automations)
        if (!request.subscriber_id || !request.field_name) {
          throw new Error("subscriber_id and field_name required");
        }

        const response = await fetch(`${MANYCHAT_API_BASE}/subscriber/setCustomField`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            subscriber_id: request.subscriber_id,
            field_id: request.field_name, // Use field ID from ManyChat
            field_value: request.field_value || "",
          }),
        });
        result = await response.json();
        break;
      }

      case "add_tag": {
        // Add a tag to a subscriber
        if (!request.subscriber_id || !request.tag_name) {
          throw new Error("subscriber_id and tag_name required");
        }

        const response = await fetch(`${MANYCHAT_API_BASE}/subscriber/addTag`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            subscriber_id: request.subscriber_id,
            tag_name: request.tag_name,
          }),
        });
        result = await response.json();
        break;
      }

      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("ManyChat trigger error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});