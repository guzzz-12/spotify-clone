import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/libs/stripe";
import { getOrCreateCustomer } from "@/libs/supabaseAdmin";
import { supabaseServerClient } from "@/utils/supabaseServerClient";
import { Price } from "@/types";

interface Body {
  price: Price;
  quantity: number;
  metadata: {};
};

/**
 * Generar la sesión de checkout de Stripe
 * para crear o actualizar la suscripción.
 */
export async function POST(req: NextRequest) {
  const {price, quantity, metadata} = (await req.json()) as Body;

  const supabase = await supabaseServerClient();

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
      success_url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/account`,
      cancel_url: process.env.NEXT_PUBLIC_PROJECT_URL,
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
      sessionUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    });
    
  } catch (error: any) {
    console.log(`Error creando sesión de Stripe: ${error.message}`);
    return new NextResponse("Internal server error", {status: 500})
  };
};


/**
 * Cancelar la suscripción del usuario
 */
export async function DELETE(_req: NextRequest) {
  try {
    const supabase = await supabaseServerClient();

    const {data} = await supabase.auth.getUser();

    if (!data.user) {
      return new NextResponse(`Unauthorized`, {status: 403})
    };

    // Buscar la suscripción del usuario en la base de datos
    const {data: subscription} = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", data.user.id)
    .single()

    if (!subscription) {
      return new NextResponse(`El usuario ${data.user.id} no posee suscripción`)
    };

    // Eliminar la suscripción
    await stripe.subscriptions.cancel(subscription.id);

    // Eliminar la suscripción del usuario en la base de datos
    const {error: deleteSubscriptionError} = await supabase
    .from("subscriptions")
    .delete()
    .eq("user_id", data.user.id)
    .single();

    if (deleteSubscriptionError) {
      throw new Error(deleteSubscriptionError.message)
    };

    return NextResponse.json({
      data: `La suscripción ${subscription.id} del usuario ${data.user.id} fue eliminada correctamente`
    });
    
  } catch (error: any) {
    console.log(`Error eliminando suscripción del usuario: ${error.message}`);
    return new NextResponse("Internal server error", {status: 500})
  }
};