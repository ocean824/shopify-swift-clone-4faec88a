import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-DISCOUNT] ${step}${detailsStr}`);
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

    const { code, cartSubtotal, context } = await req.json();
    if (!code) {
      throw new Error("No discount code provided");
    }

    logStep("Validating code", { code: code.toUpperCase(), context });

    // Look up the discount code
    const { data: discountCode, error: codeError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (codeError) {
      logStep("Database error", { error: codeError.message });
      throw new Error("Error looking up discount code");
    }

    if (!discountCode) {
      logStep("Code not found or inactive");
      return new Response(JSON.stringify({
        valid: false,
        message: "Invalid or expired discount code"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Block subscription-only codes from being used in the cart checkout
    if (context === 'cart' && (discountCode.grants_pantheon_lifetime || discountCode.applies_to === 'subscription')) {
      logStep("Code is subscription-only, blocked from cart use");
      return new Response(JSON.stringify({
        valid: false,
        message: "This code is for subscriptions only. Use it on the Subscribe page."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check validity dates
    const now = new Date();
    if (discountCode.valid_from && new Date(discountCode.valid_from) > now) {
      return new Response(JSON.stringify({
        valid: false,
        message: "This code is not yet active"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (discountCode.valid_until && new Date(discountCode.valid_until) < now) {
      return new Response(JSON.stringify({
        valid: false,
        message: "This discount code has expired"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check max uses
    if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
      return new Response(JSON.stringify({
        valid: false,
        message: "This discount code has reached its usage limit"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Calculate the discount
    let discountAmount = 0;
    let discountDisplay = '';

    if (discountCode.discount_type === 'percentage') {
      discountAmount = (cartSubtotal || 0) * (discountCode.discount_value / 100);
      discountDisplay = `${discountCode.discount_value}% off`;
    } else if (discountCode.discount_type === 'fixed') {
      discountAmount = discountCode.discount_value;
      discountDisplay = `$${discountCode.discount_value} off`;
    } else if (discountCode.discount_type === 'free') {
      discountAmount = cartSubtotal || 0;
      discountDisplay = 'Free!';
    }

    logStep("Code validated successfully", {
      code: discountCode.code,
      type: discountCode.discount_type,
      value: discountCode.discount_value,
      discountAmount,
      grantsLifetime: discountCode.grants_pantheon_lifetime
    });

    return new Response(JSON.stringify({
      valid: true,
      code: discountCode.code,
      discountType: discountCode.discount_type,
      discountValue: discountCode.discount_value,
      discountAmount,
      discountDisplay,
      grantsLifetime: discountCode.grants_pantheon_lifetime,
      description: discountCode.description,
      message: `Code applied: ${discountDisplay}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in validate-discount", { message: errorMessage });
    return new Response(JSON.stringify({ 
      valid: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
