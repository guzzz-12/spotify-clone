"use client"

import { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import GenericModal from "./GenericModal";
import Button from "./Button";
import Typography from "./Typography";
import useSubscriptionModal from "@/hooks/useSubscriptionModal";
import { UserContext } from "@/context/UserProvider";
import { getStripe } from "@/libs/stripeClient";
import { Price, ProductsWithPrices } from "@/types";

interface Props {
  products: ProductsWithPrices[]
};

/** Formatear el precio en formato moneda */
const priceFormatted = (price: Price) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0
  })
  .format((price.unit_amount || 0) / 100);

  return formatted;
};

const SubscriptionModal = (props: Props) => {
  const {products} = props;
  
  const {user, subscription, isLoadingUser, isLoadingSubscription, updateSubscriptionState} = useContext(UserContext);

  const {isOpen, isUpdate, onOpenChange} = useSubscriptionModal();

  const [isLoading, setIsLoading] = useState(false);


  /** Iniciar la suscripción del usuario */
  const onClickHandler = async (price: Price) => {
    if (!user && !isLoadingUser) {
      return null
    };

    try {
      const data = {
        price,
        quantity: 1,
        metadata: {}
      };

      const res = await fetch("/api/subscription", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({"Content-Type": "application/json"}),
        credentials: "same-origin"
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      };

      const resData = await res.json();

      const stripe = await getStripe();

      if (!stripe) {
        return toast.error("Error creating subscription. Reload the page and try again")
      };

      stripe.redirectToCheckout({sessionId: resData.data.sessionId});

    } catch (error: any) {
      toast.error(`Error creating subscription: ${error.message}`)
      
    } finally {
      setIsLoading(false)
    };
  };
  
  
  /** Cancelar la suscripción del usuario */
  const cancelSubscriptionHandler = async () => {
    try {
      setIsLoading(true);
      
      await fetch("/api/subscription", {
        method: "DELETE",
        credentials: "same-origin"
      });

      toast("Your subscription was successfully cancelled");

      updateSubscriptionState(null);
      onOpenChange(false);
      
    } catch (error: any) {
      toast.error(`Error canceling subscription: ${error.message}`);

    } finally {
      setIsLoading(false)
    }
  };


  return (
    <GenericModal
      title={isUpdate ? "Update subscription" : "Subscribe to Spotify Clone"}
      description={isUpdate ? "Update or cancel your subscription to Spotify Clone" : "Become a premium user to upload your songs"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {products.length === 0 &&
        <h2 className="text-lg text-center">
          No subscritions available
        </h2>
      }

      {products.length > 0 &&
        <div className="flex flex-col justify-stretch items-center w-full">
          {products.map(product => {
            if (!product.prices?.length) {
              return null
            };

            return (
              <div key={product.id}>
                {product.prices.map(price => {
                  if (!subscription || subscription.prices!.id !== price.id) {
                    return (
                      <Button
                        key={price.id}
                        className="w-full mb-4"
                        disabled={isLoading || isLoadingUser || isLoadingSubscription}
                        onClickHandler={onClickHandler.bind(null, price)}
                      >
                        Subscribe to {product.name} ({priceFormatted(price)}/{price.interval})
                      </Button>
                    );
                  };
                  
                  if (subscription && subscription.prices!.id === price.id) {
                    return (
                      <Button
                        key={price.id}
                        className="w-full mb-4"
                        disabled={isLoading || isLoadingUser || isLoadingSubscription}
                        onClickHandler={cancelSubscriptionHandler}
                      >
                        Cancel subscription to {product.name}
                      </Button>
                    )
                  };

                  return null;
                })}
              </div>
            )
          })}
        </div>
      }
    </GenericModal>
  )
};

export default SubscriptionModal;