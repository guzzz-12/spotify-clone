import { NextRequest, NextResponse } from "next/server";
// import { headers } from "next/headers";
import Stripe from "stripe";

import { stripe } from "@/libs/stripe";
import { upsertProduct, upsertPrice, manageSubscriptionStatus, deleteProduct } from "@/libs/supabaseAdmin";

enum StripeEvents {
  PRODUCT_CREATED = "product.created",
  PRODUCT_UPDATED = "product.updated",
  PRODUCT_DELETED = "product.deleted",
  PRICE_CREATED = "price.created",
  PRICE_UPDATED = "price.updated",
  CHECKOUT_SESSION_COMPLETED = "checkout.session.completed",
  CUSTOMER_SUBSCRIPTION_CREATED = "customer.subscription.created",
  CUSTOMER_SUBSCRIPTION_UPDATED = "customer.subscription.updated",
  CUSTOMER_SUBSCRIPTION_DELETED = "customer.subscription.deleted"
};

// Secret del endpoint del webhook para generar el signature
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  console.log({signature});

  if (!webhookSecret) {
    throw new Error("Secret del webhook de Stripe inválido")
  };

  if (!signature || !webhookSecret) {
    throw new Error("Signature de Stripe inválida")
  };

  
  try {
    const event: Stripe.Event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    const currentEvent = event.type as StripeEvents;

    switch(currentEvent) {
      case StripeEvents.PRODUCT_CREATED:
      case StripeEvents.PRODUCT_UPDATED: {
        const productData = event.data.object as Stripe.Product;
        await upsertProduct(productData);
        break;
      };

      case StripeEvents.PRODUCT_DELETED: {
        const productData = event.data.object as Stripe.Product;
        await deleteProduct(productData);
        break;
      };

      case StripeEvents.PRICE_CREATED:
      case StripeEvents.PRICE_UPDATED: {
        const priceData = event.data.object as Stripe.Price;
        await upsertPrice(priceData);
        break;
      };

      case StripeEvents.CUSTOMER_SUBSCRIPTION_CREATED:
      case StripeEvents.CUSTOMER_SUBSCRIPTION_UPDATED: {
        const subscriptionData = event.data.object as Stripe.Subscription;
        const {id, customer} = subscriptionData;

        // Eliminar la suscripción de la base de datos si se canceló
        if (subscriptionData.status === "canceled") {
          const subscriptionData = event.data.object as Stripe.Subscription;

          const {id, customer} = subscriptionData;

          await manageSubscriptionStatus({
            subscriptionId: id,
            customerId: customer as string,
            action: "delete"
          });
          
          return;
        };

        await manageSubscriptionStatus({
          subscriptionId: id,
          customerId: customer as string,
          action: event.type === StripeEvents.CUSTOMER_SUBSCRIPTION_CREATED ? "create" : "update"
        });

        break;
      };

      case StripeEvents.CUSTOMER_SUBSCRIPTION_DELETED: {
        const subscriptionData = event.data.object as Stripe.Subscription;

        const {id, customer} = subscriptionData;

        await manageSubscriptionStatus({
          subscriptionId: id,
          customerId: customer as string,
          action: "delete"
        });

        break;
      };

      case StripeEvents.CHECKOUT_SESSION_COMPLETED: {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        if (checkoutSession.mode === "subscription") {
          const {subscription, customer} = checkoutSession;

          await manageSubscriptionStatus({
            subscriptionId: subscription as string,
            customerId: customer as string,
            action: "create"
          });
        };

        break;
      };

      default:
        throw new Error("Evento de Stripe inválido")
    };

    return NextResponse.json(
      {data: "Subscripción actualizada correctamente"},
      {status: 200}
    );
    
  } catch (error: any) {
    console.log(`Error procesando webhook de Stripe: ${error.message}`);
    return new NextResponse("Internal server error", {status: 500})
  }
};