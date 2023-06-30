import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { Price, Product } from "@/types";
import { stripe } from "./stripe";
import { toDateTime } from "./helpers";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Actualizar o insertar un product de Stripe en la base de datos */
export const upsertProduct = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.images[0],
    active: product.active,
    metadata: product.metadata
  };

  try {
    const {error} = await supabaseAdmin.from("products").upsert(productData);

    if (error) {
      throw new Error(error.message)
    };

    console.log(`Producto ${product.id} creado/actualizado exitosamente`);

  } catch (error: any) {
    console.log(`Error creando producto: ${error.message}`)
  };
};

/** Actualizar o insertar un price de Stripe en la base de datos */
export const upsertPrice = async (priceData: Stripe.Price) => {
  const price: Price = {
    id: priceData.id,
    active: priceData.active,
    currency: priceData.currency,
    description: null,
    interval: priceData.recurring?.interval,
    interval_count: priceData.recurring?.interval_count,
    product_id: typeof priceData.product,
    trial_period_days: priceData.recurring?.trial_period_days,
    type: priceData.type,
    unit_amount: priceData.unit_amount,
    metadata: priceData.metadata
  };

  try {
    const {error} = await supabaseAdmin.from("prices").upsert(price);

    if (error) {
      throw new Error(error.message)
    };

    console.log(`Price ${price.id} creado/actualizado correctamente`);
    
  } catch (error: any) {
    console.log(`Error creando price: ${error.message}`)
  }
};


/** Consultar o crear un customer en Stripe asociado al usuario de Supabase */
export const getOrCreateCustomer = async (props: {email: string, uuid: string}) => {
  try {
    const {email, uuid} = props;

    // Chequear si el usuario asociado al UUID existe en la base de datos
    const {data: userData, error: userError} = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("id", uuid)
    .single();

    if (!userData && !userError) {
      throw new Error(`No existe un usuario asociado al ID ${uuid}`)
    };

    // Consultar si existe en la DB un customer asociado al UUID
    const {data, error} = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

    // Si no existe el customer, crearlo en Stripe y agregarlo a la DB
    if (!data && !error) {
      const newCustomer = {
        metadata: {
          supabaseUUID: uuid,
          email
        }
      };

      const customer = await stripe.customers.create({metadata: newCustomer.metadata});

      const {error} = await supabaseAdmin
      .from("customers")
      .insert({id: uuid, stripe_customer_id: customer.id});

      if (error) {
        throw new Error(error.message)
      };

      console.log(`Customer ${customer.id} creado exitosamente`);
  
      return {stripe_customer_id: customer.id};
    };

    if (error) {
      throw new Error(error.message)
    };

    return data;

  } catch (error: any) {
    console.log(`Error creando o consultando customer: ${error.message}`)
  }
};


/** Actualizar el billing details del usuario especificado */
export const updateUserBillingDetails = async (props: {uuid: string, payment_method: Stripe.PaymentMethod}) => {
  const {uuid, payment_method} = props;

  const customer = payment_method.customer as string;
  const {name, address, phone} = payment_method.billing_details;

  if (!name || !address || !phone) {
    return null;
  };

  try {
    const {error} = await supabaseAdmin
    .from("users")
    .update({
      billing_address: {...address},
      stripe_customer: customer,
      payment_method: {...payment_method[payment_method.type]}
    })
    .eq("id", uuid);

    if (error) {
      throw new Error(error.message)
    };

    console.log(`Billing details del usuario ${uuid} actualizados correctamente`);
    
  } catch (error: any) {
    console.log(`Error actualizando billing details del usuario: ${error.message}`)
  }
};


/** Crear o actualizar el status de la suscripción del usuario */
export const manageSubscriptionStatus = async (props: {subscriptionId: string, customerId: string, action: "create" | "update"}) => {
  const {customerId, subscriptionId, action} = props;

  try {
    const {data: customerData, error: customerError} = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

    if (customerError) {
      throw new Error(customerError.message)
    };

    const {id: uuid} = customerData;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    });

    const {id, metadata, status, created, cancel_at, canceled_at, cancel_at_period_end, ended_at, current_period_end, current_period_start, trial_start, trial_end} = subscription;

    const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] = {
      id,
      user_id: uuid,
      metadata,
      price_id: subscription.items.data[0].price.id,
      status,
      quantity: 0,
      created: toDateTime(created).toTimeString(),
      canceled_at: canceled_at ? toDateTime(canceled_at).toTimeString() : null,
      cancel_at: cancel_at ? toDateTime(cancel_at).toTimeString() : null,
      cancel_at_period_end,
      ended_at: ended_at ? toDateTime(ended_at).toTimeString() : null,
      current_period_end: toDateTime(current_period_end).toTimeString(),
      current_period_start: toDateTime(current_period_start).toTimeString(),
      trial_start: trial_start ? toDateTime(trial_start).toTimeString() : null,
      trial_end: trial_end ? toDateTime(trial_end).toTimeString() : null
    };

    const {error} = await supabaseAdmin.from("subscriptions").upsert(subscriptionData);

    if (error) {
      throw new Error(error.message)
    };

    console.log(`Suscripción ${{usuario: uuid, customerId}} creada/actualizada correctamente`);

    // Si la suscripción es nueva, actualizar el billing details del usuario en la DB
    if (action === "create") {
      const props = {
        uuid,
        payment_method: subscription.default_payment_method as Stripe.PaymentMethod
      }
      await updateUserBillingDetails(props)
    };
    
  } catch (error: any) {
    console.log(`Error actualizando/creando suscripción del usuario: ${error.message}`)
  }
};