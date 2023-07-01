import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { stripe } from "@/libs/stripe";
import { getOrCreateCustomer } from "@/libs/supabaseAdmin";
import { Database } from "@/types/supabase";
import { Price } from "@/types";

interface Body {
  price: Price;
  quantity: number;
  metadata: {};
};

/**
 * Generar la sesión de checkout de Stripe
 */
export async function POST(req: NextRequest) {
  const {price, quantity, metadata} = (await req.json()) as Body;

  const supabase = createRouteHandlerClient<Database>({cookies});

  const {data} = await supabase.auth.getUser();

  if (!data.user) {
    return new NextResponse(`Unauthorized`, {status: 403})
  };

  const customer = await getOrCreateCustomer({
    uuid: data.user.id,
    name: data.user.user_metadata.name || "",
    email: data.user.email as string
  });

  if (!customer) {
    return new NextResponse(`Customer not found for the user ${data.user.id}`, {status: 403})
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer: customer.stripe_customer_id,
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL,
      subscription_data: {
        metadata,
        trial_from_plan: false
      },
      line_items: [
        {
          price: price.id,
          quantity
        }
      ]
    });
  
    return NextResponse.json({
      data: {
        sessionUrl: checkoutSession.url,
        sessionId: checkoutSession.id
      }
    });
    
  } catch (error: any) {
    console.log(`Error creando sesión de Stripe: ${error.message}`);
    return new NextResponse("Internal server error", {status: 500})
  };
};