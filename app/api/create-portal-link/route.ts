import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { stripe } from "@/libs/stripe";
import { getOrCreateCustomer } from "@/libs/supabaseAdmin";
import { getUrl } from "@/libs/helpers";

/**
 * Generar la URL de la sesión de checkout de Stripe
 */
export async function POST() {
  try {
    const supabase = createRouteHandlerClient({cookies});

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse(`Unauthorized`, {status: 403})
    };

    const customer = await getOrCreateCustomer({uuid: user.id, email: user.email!});

    if (!customer) {
      return new NextResponse(`Customer not found for the user ${user.id}`, {status: 403})
    };

    const {url} = await stripe.billingPortal.sessions.create({
      customer: customer.stripe_customer_id,
      return_url: `${getUrl()}/account`
    });

    return NextResponse.json({data: {sessionUrl: url}});
    
  } catch (error: any) {
    console.log(`Error creando session url de Stripe: ${error.message}`);
    return new NextResponse("Internal server error", {status: 500})
  }
};