import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-DISCOUNT-TO-SHOPIFY] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) throw new Error("Not authenticated");

    // Check admin status using the is_admin function
    const { data: isAdminResult } = await supabaseClient.rpc('is_admin', { 
      user_email: userData.user.email 
    });
    
    if (!isAdminResult) {
      throw new Error("Not authorized - admin only");
    }

    const { code, discountType, discountValue, validUntil } = await req.json();
    
    if (!code) {
      throw new Error("Discount code is required");
    }

    const shopifyAccessToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    const shopifyDomain = "samplesociety.myshopify.com";
    
    if (!shopifyAccessToken) {
      logStep("No Shopify access token - code will only work locally");
      return new Response(JSON.stringify({
        success: true,
        synced: false,
        message: "Code created locally. Shopify sync not configured."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Calculate discount percentage for Shopify
    let discountPercentage = 0;
    if (discountType === 'percentage') {
      discountPercentage = discountValue;
    } else if (discountType === 'free') {
      discountPercentage = 100;
    }
    // Note: Fixed amount discounts would need a different Shopify mutation

    // Create price rule and discount code in Shopify using Admin API
    const createPriceRuleResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/price_rules.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        body: JSON.stringify({
          price_rule: {
            title: code,
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value_type: discountType === 'fixed' ? 'fixed_amount' : 'percentage',
            value: discountType === 'fixed' ? `-${discountValue}` : `-${discountPercentage}`,
            customer_selection: "all",
            starts_at: new Date().toISOString(),
            ends_at: validUntil ? new Date(validUntil).toISOString() : null,
          }
        }),
      }
    );

    if (!createPriceRuleResponse.ok) {
      const error = await createPriceRuleResponse.text();
      logStep("Shopify price rule creation failed", { error });
      // Don't fail - code still works locally
      return new Response(JSON.stringify({
        success: true,
        synced: false,
        message: "Code created locally. Shopify sync failed: " + error
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const priceRuleData = await createPriceRuleResponse.json();
    const priceRuleId = priceRuleData.price_rule.id;
    logStep("Price rule created", { priceRuleId });

    // Create the discount code
    const createCodeResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/price_rules/${priceRuleId}/discount_codes.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        body: JSON.stringify({
          discount_code: {
            code: code.toUpperCase(),
          }
        }),
      }
    );

    if (!createCodeResponse.ok) {
      const error = await createCodeResponse.text();
      logStep("Shopify discount code creation failed", { error });
      return new Response(JSON.stringify({
        success: true,
        synced: false,
        message: "Code created locally. Shopify code creation failed."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const codeData = await createCodeResponse.json();
    logStep("Discount code synced to Shopify", { 
      code: codeData.discount_code.code,
      id: codeData.discount_code.id 
    });

    return new Response(JSON.stringify({
      success: true,
      synced: true,
      shopifyCodeId: codeData.discount_code.id,
      message: "Code synced to Shopify successfully!"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
