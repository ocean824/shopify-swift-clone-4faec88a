import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-PURCHASES] ${step}${detailsStr}`);
};

// All available products for VIP accounts
const ALL_PRODUCTS = [
  { product_name: 'ALL KITS BUNDLE 2025', product_id: 'all-kits-bundle-2025', amount: 199.99 },
  { product_name: 'Moonlight Drum Kit Vol. 1', product_id: 'moonlight-drumkit', amount: 24.99 },
  { product_name: 'Mana Vol. 1', product_id: 'mana-vol-1', amount: 24.99 },
  { product_name: 'Haze Midi Phrases Vol. 1', product_id: 'haze-midi-phrases', amount: 19.99 },
  { product_name: 'Unrequited Love Vol. 2', product_id: 'unrequited-love-vol-2', amount: 24.99 },
  { product_name: 'Unrequited Love Vol. 1', product_id: 'unrequited-love-vol-1', amount: 24.99 },
  { product_name: 'VZN Compositions Vol. 1', product_id: 'vzn-compositions', amount: 24.99 },
  { product_name: 'Abstract Minds Vol. 1', product_id: 'abstract-minds', amount: 24.99 },
  { product_name: 'Vibrant Darkness Vol. 1', product_id: 'vibrant-darkness', amount: 24.99 },
  { product_name: 'Stained Glass Vol. 2', product_id: 'stained-glass-vol-2', amount: 24.99 },
  { product_name: 'Stained Glass Vol. 1', product_id: 'stained-glass-vol-1', amount: 24.99 },
  { product_name: 'Vintage Vibes Vol. 1', product_id: 'vintage-vibes', amount: 24.99 },
  { product_name: 'Gray Area Vol. 1', product_id: 'gray-area', amount: 24.99 },
  { product_name: 'Black Friday Vol. 1', product_id: 'black-friday', amount: 24.99 },
  { product_name: 'The Feels Vol. 1', product_id: 'the-feels', amount: 24.99 },
  { product_name: 'Flood Szn Vol. 2', product_id: 'flood-szn-vol-2', amount: 24.99 },
  { product_name: 'Flood Szn Vol. 1', product_id: 'flood-szn-vol-1', amount: 24.99 },
];

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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check for VIP status first
    const { data: vipAccount } = await supabaseClient
      .from('vip_accounts')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    if (vipAccount?.has_all_products) {
      logStep("VIP account found with all products access", { email: user.email });
      
      // Return all products as "purchased" for VIP accounts
      const vipPurchases = ALL_PRODUCTS.map((p, index) => ({
        id: `vip_${p.product_id}`,
        productName: p.product_name,
        amount: 0, // Free for VIP
        currency: 'USD',
        purchaseDate: new Date().toISOString(),
        email: user.email,
        isVipAccess: true,
      }));

      return new Response(JSON.stringify({ purchases: vipPurchases, isVip: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Fetch purchases from database by email for regular users
    const { data: purchases, error: purchasesError } = await supabaseClient
      .from('purchases')
      .select('*')
      .eq('email', user.email)
      .order('purchase_date', { ascending: false });

    if (purchasesError) {
      logStep("Error fetching purchases", { error: purchasesError.message });
      throw new Error(`Failed to fetch purchases: ${purchasesError.message}`);
    }

    logStep("Fetched purchases from database", { count: purchases?.length || 0 });

    // Format the response
    const formattedPurchases = (purchases || []).map((p) => ({
      id: p.id,
      productName: p.product_name,
      amount: Number(p.amount),
      currency: p.currency,
      purchaseDate: p.purchase_date,
      email: p.email,
    }));

    return new Response(JSON.stringify({ purchases: formattedPurchases }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
