"use server"

import Stripe from "stripe";
import { Database } from "@/types/supabase";
import { Price, Product } from "@/types";
import { stripe } from "./stripe";
import { toDateTime } from "./helpers";
import { supabaseServerClient } from "@/utils/supabaseServerClient";

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
    const supabase = await supabaseServerClient();

    const {error} = await supabase.from("products").upsert(productData);

    if (error) {
      throw new Error(error.message)
    };

    console.log(`Producto ${product.id} creado/actualizado exitosamente`);

  } catch (error: any) {
    console.log(`Error creando producto: ${error.message}`)
  };
};

/** Eliminar un product y su price asociado */
export const deleteProduct = async (productData: Stripe.Product) => {
  try {
    const supabase = await supabaseServerClient();

    const {error} = await supabase
    .from("products")
    .delete()
    .eq("id", productData.id)
    .single();

    if (error) {
      throw new Error(error.message)
    };

    console.log(`Producto ${productData.id} (${productData.name}) eliminado exitosamente`)
    
  } catch (error: any) {
    console.log(`Error eliminando producto: ${error.message}`)
  }
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
    product_id: priceData.product as string,
    trial_period_days: priceData.recurring?.trial_period_days,
    type: priceData.type,
    unit_amount: priceData.unit_amount,
    metadata: priceData.metadata
  };

  try {
    const supabase = await supabaseServerClient();

    const {error} = await supabase.from("prices").upsert(price);

    if (error) {
      throw new Error(error.message)
    };

    console.log(`Price ${price.id} creado/actualizado correctamente`);
    
  } catch (error: any) {
    console.log(`Error creando price: ${error.message}`)
  }
};


/** Consultar o crear un customer en Stripe asociado al usuario de Supabase */
export const getOrCreateCustomer = async (props: {uuid: string, name: string, email: string}) => {
  try {
    const {uuid, name, email} = props;

    const supabase = await supabaseServerClient();

    // Chequear si el usuario asociado al UUID existe en la base de datos
    const {data: userData, error: userError} = await supabase
      .from("users")
      .select("*")
      .eq("id", uuid);

    if (userError) {
      throw new Error(userError.message);
    }

    if (!userData) {
      throw new Error(`No existe un usuario asociado al ID ${uuid}`)
    };

    // Consultar si existe en la DB un customer asociado al UUID
    const {data: customerData, error: customerError} = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("id", uuid);

    if (customerError) {
      throw new Error(customerError.message)
    };

    // Si no existe el customer, crearlo en Stripe y agregarlo a la DB
    if (customerData.length === 0) {
      // Crear el customer en Stripe
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          supabaseId: uuid
        }
      });

      // Almacenar el customer en la DB
      const {data: newCustomerData, error} = await supabase
        .from("customers")
        .insert({id: uuid, stripe_customer_id: customer.id})
        .select("stripe_customer_id");

      if (error) {
        throw new Error(error.message)
      };

      console.log(`Customer ${customer.id} creado exitosamente`);

      // Agregar el customer de Stripe al usuario en Supabase
      const {error: userUpdateError} = await supabase
        .from("users")
        .update({stripe_customer: customer.id})
        .eq("id", uuid);

      // Eliminar el customer de Stripe y de Supabase si hay error
      // al actualizar el usuario en Supabase
      if (userUpdateError) {
        const customerId = newCustomerData[0].stripe_customer_id;
        await stripe.customers.del(customerId);
        await supabase.from("customers").delete().eq("stripe_customer_id", customerId);
        throw new Error(userUpdateError.message);
      };
  
      return newCustomerData[0];
    };

    return customerData[0];

  } catch (error: any) {
    console.log(`Error creando o consultando customer: ${error.message}`);
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
    const supabase = await supabaseServerClient();

    const {error} = await supabase
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


/** Crear, actualizar o eliminar la suscripción del usuario */
export const manageSubscriptionStatus = async (props: {subscriptionId: string, customerId: string, action: "create" | "update" | "delete"}) => {
  const {customerId, subscriptionId, action} = props;

  try {
    const supabase = await supabaseServerClient();

    const {data: customerData, error: customerError} = await supabase
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId);

    if (customerError) {
      throw new Error(customerError.message)
    };

    if (customerData.length === 0) {
      throw new Error("Customer not found or deleted");
    }

    const {id: uuid} = customerData[0];

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
      created: toDateTime(created).toISOString(),
      canceled_at: canceled_at ? toDateTime(canceled_at).toISOString() : null,
      cancel_at: cancel_at ? toDateTime(cancel_at).toISOString() : null,
      cancel_at_period_end,
      ended_at: ended_at ? toDateTime(ended_at).toISOString() : null,
      current_period_end: toDateTime(current_period_end).toISOString(),
      current_period_start: toDateTime(current_period_start).toISOString(),
      trial_start: trial_start ? toDateTime(trial_start).toISOString() : null,
      trial_end: trial_end ? toDateTime(trial_end).toISOString() : null
    };

    if (action === "delete") {
      const {error: deleteError} = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", subscriptionId);

      if (deleteError) {
        throw new Error(deleteError.message)
      };

      return console.log(`Suscripción ${{usuario: uuid, customerId}} eliminada correctamente`);
    };

    // Si se creó una nueva suscripción
    // eliminar la anterior si la posee
    // para evitar múltiples suscripciones.
    if (action === "create") {
      // Verificar si ya posee una suscripción
      const {data: currentSubscription} = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", uuid)
      .neq("id", subscriptionData.id);

      if (!currentSubscription || currentSubscription.length === 0) {
        throw new Error("Subscription not found or canceled");
      }

      // Eliminar la suscripción actual si la tiene
      // Al cancelar la suscripción en Stripe, el webhook
      // la elimina automáticamente de la base de datos
      // en el evento CUSTOMER_SUBSCRIPTION_DELETED
      await stripe.subscriptions.cancel(currentSubscription[0].id);
    };
    
    const {error} = await supabase.from("subscriptions").upsert(subscriptionData);

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