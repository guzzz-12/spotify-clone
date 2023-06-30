import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { stripe } from "@/libs/stripe";
import { getURL } from "next/dist/shared/lib/utils";
import { getOrCreateCustomer } from "@/libs/supabaseAdmin";
import { Database } from "@/types/supabase";
import { Price } from "@/types";
import { getUrl } from "@/libs/helpers";

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

  const {data: {user}} = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(`Unauthorized`, {status: 403})
  };

  const customer = await getOrCreateCustomer({uuid: user.id, email: user.email!});

  if (!customer) {
    return new NextResponse(`Customer not found for the user ${user.id}`, {status: 403})
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer: customer.stripe_customer_id,
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${getURL()}/account`,
      cancel_url: getUrl(),
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