import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REDOWNLOAD] ${step}${detailsStr}`);
};

const SHOPIFY_STORE_DOMAIN = 'samplesociety.myshopify.com';
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const REDOWNLOAD_DISCOUNT_CODE = 'REDOWNLOAD100';

// GraphQL query to search for product by title
const PRODUCT_SEARCH_QUERY = `
  query searchProduct($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          id
          title
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL mutation to create cart with discount
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function storefrontRequest(query: string, variables: Record<string, unknown> = {}) {
  const storefrontToken = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  if (!storefrontToken) {
    throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN not configured");
  }

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors.map((e: { message: string }) => e.message).join(', '));
  }

  return data;
}

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

    const { purchaseId, productName } = await req.json();
    if (!purchaseId || !productName) {
      throw new Error("Purchase ID and product name are required");
    }

    logStep("Redownload request received", { purchaseId, productName, email: user.email });

    // Search for the product in Shopify by title
    const searchData = await storefrontRequest(PRODUCT_SEARCH_QUERY, {
      query: `title:${productName}`,
    });

    const product = searchData?.data?.products?.edges?.[0]?.node;
    if (!product) {
      throw new Error(`Product not found: ${productName}`);
    }

    const variantId = product.variants.edges?.[0]?.node?.id;
    if (!variantId) {
      throw new Error(`No variant found for product: ${productName}`);
    }

    logStep("Product found", { productId: product.id, variantId });

    // Create a cart with the product and 100% discount code
    const cartData = await storefrontRequest(CART_CREATE_MUTATION, {
      input: {
        lines: [{ quantity: 1, merchandiseId: variantId }],
        discountCodes: [REDOWNLOAD_DISCOUNT_CODE],
        buyerIdentity: {
          email: user.email,
        },
      },
    });

    const cart = cartData?.data?.cartCreate?.cart;
    const userErrors = cartData?.data?.cartCreate?.userErrors;

    if (userErrors?.length > 0) {
      throw new Error(`Cart creation failed: ${userErrors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    if (!cart?.checkoutUrl) {
      throw new Error("Failed to create checkout URL");
    }

    // Add channel parameter to make checkout work
    const checkoutUrl = new URL(cart.checkoutUrl);
    checkoutUrl.searchParams.set('channel', 'online_store');

    logStep("Checkout created", { checkoutUrl: checkoutUrl.toString() });

    return new Response(JSON.stringify({ 
      success: true,
      checkoutUrl: checkoutUrl.toString(),
      message: `Complete checkout to receive download email at ${user.email}` 
    }), {
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
