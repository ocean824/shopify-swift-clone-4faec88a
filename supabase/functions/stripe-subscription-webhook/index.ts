import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-SUB-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const body = await req.text();
    let event: Stripe.Event;

    if (webhookSecret) {
      const signature = req.headers.get("stripe-signature");
      if (!signature) throw new Error("No stripe-signature header");
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified");
    } else {
      event = JSON.parse(body);
      logStep("No webhook secret configured, parsing body directly");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle checkout.session.completed — create user if needed + record subscription
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email || session.customer_email;

      if (!customerEmail) {
        logStep("No customer email found in session");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      logStep("Processing checkout completion", { email: customerEmail, mode: session.mode });

      // Create user if they don't exist
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
      );

      if (existingUser) {
        logStep("User already exists", { userId: existingUser.id });
      } else {
        const tempPassword = crypto.randomUUID() + crypto.randomUUID();
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: tempPassword,
          email_confirm: true,
        });

        if (createError) {
          logStep("Error creating user", { error: createError.message });
        } else {
          logStep("User created", { userId: newUser.user?.id });
          const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
            type: "recovery",
            email: customerEmail,
            options: {
              redirectTo: `${session.success_url?.split('?')[0]?.replace('/subscribe', '')}/auth?tab=reset`,
            },
          });
          if (resetError) logStep("Error sending password setup email", { error: resetError.message });
          else logStep("Password setup email sent");
        }
      }

      // If it's a subscription checkout, fetch the subscription and record it
      if (session.mode === "subscription" && session.subscription) {
        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subId);
        await upsertSubscriptionStatus(supabaseAdmin, subscription, customerEmail);
      }
    }

    // Handle subscription lifecycle events
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Get customer email from Stripe
      let customerEmail: string | null = null;
      if (typeof subscription.customer === "string") {
        const customer = await stripe.customers.retrieve(subscription.customer);
        if (!customer.deleted) {
          customerEmail = customer.email;
        }
      }

      if (customerEmail) {
        await upsertSubscriptionStatus(supabaseAdmin, subscription, customerEmail);
        logStep("Subscription status updated", { 
          email: customerEmail, 
          status: subscription.status,
          event: event.type,
        });
      } else {
        logStep("Could not resolve customer email for subscription event");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function upsertSubscriptionStatus(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription,
  email: string
) {
  const { error } = await supabase
    .from("subscription_status")
    .upsert(
      {
        email: email.toLowerCase(),
        stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      },
      { onConflict: "stripe_subscription_id" }
    );

  if (error) {
    console.error("Error upserting subscription_status:", error);
    throw error;
  }
}
