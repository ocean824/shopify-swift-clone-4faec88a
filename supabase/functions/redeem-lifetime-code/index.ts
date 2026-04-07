import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REDEEM-LIFETIME-CODE] ${step}${detailsStr}`);
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

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) throw new Error("Authentication failed");

    const userEmail = userData.user.email;
    logStep("User authenticated", { email: userEmail });

    const { code } = await req.json();
    if (!code) throw new Error("No code provided");

    const upperCode = code.toUpperCase().trim();
    logStep("Validating code", { code: upperCode });

    // Look up the discount code
    const { data: discountCode, error: codeError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('code', upperCode)
      .eq('is_active', true)
      .eq('grants_pantheon_lifetime', true)
      .maybeSingle();

    if (codeError || !discountCode) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid or expired code"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if already redeemed by this user
    const { data: existingRedemption } = await supabaseClient
      .from('code_redemptions')
      .select('id')
      .eq('user_email', userEmail)
      .eq('code_id', discountCode.id)
      .eq('is_revoked', false)
      .maybeSingle();

    if (existingRedemption) {
      return new Response(JSON.stringify({
        success: false,
        message: "You have already redeemed this code"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check max uses
    if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
      return new Response(JSON.stringify({
        success: false,
        message: "This code has reached its usage limit"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create redemption record
    const { error: redemptionError } = await supabaseClient
      .from('code_redemptions')
      .insert({
        code_id: discountCode.id,
        user_email: userEmail,
      });

    if (redemptionError) {
      logStep("Redemption insert error", { error: redemptionError.message });
      throw new Error("Failed to redeem code");
    }

    // Increment usage count
    await supabaseClient
      .from('discount_codes')
      .update({ current_uses: (discountCode.current_uses || 0) + 1 })
      .eq('id', discountCode.id);

    logStep("Code redeemed successfully", { email: userEmail, code: upperCode });

    return new Response(JSON.stringify({
      success: true,
      message: "🎉 Lifetime Pantheon access activated!",
      plan: "lifetime",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
