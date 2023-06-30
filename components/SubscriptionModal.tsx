"use client"

import { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import GenericModal from "./GenericModal";
import Button from "./Button";
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
  
  const {user, subscription, isLoadingUser, isLoadingSubscription} = useContext(UserContext);

  const {isOpen, onOpenChange} = useSubscriptionModal();

  const [isLoading, setIsLoading] = useState(false);


  /** Iniciar la suscripción del usuario */
  const onClickHandler = async (price: Price) => {
    if (!user && !isLoadingUser) {
      return null
    };

    if (subscription) {
      setTimeout(() => {
        onOpenChange(false)
      }, 3000);

      return toast.error("You are already subscribed")
    };

    try {
      const data = {
        price,
        quantity: 1,
        metadata: {}
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({"Content-Type": "application/json"}),
        credentials: "same-origin"
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      };

      const {sessionId} = await res.json();

      const stripe = await getStripe();

      if (!stripe) {
        return toast.error("Error creating subscription. Reload the page and try again")
      };

      stripe.redirectToCheckout({sessionId});

    } catch (error: any) {
      toast.error(`Error creating subscription: ${error.message}`)

    } finally {
      setIsLoading(false)
    };
  };


  return (
    <GenericModal
      title="Subscribe to Spotify Clone"
      description="Subscribe to become a premium user"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {products.length === 0 &&
        <h2 className="text-lg text-center">
          No products available
        </h2>
      }

      {products.length > 0 &&
        <div>
          {products.map(product => {
            if (!product.prices?.length) {
              return (
                <div key={product.id}>
                  <h2>No prices available</h2>
                </div>
              )
            };

            return product.prices.map(price => {
              return (
                <Button
                  key={price.id}
                  className="mb-4"
                  disabled={isLoading || isLoadingUser || isLoadingSubscription}
                  onClickHandler={onClickHandler.bind(null, price)}
                >
                  Subscribe for {priceFormatted(price)} a {price.interval}
                </Button>
              )
            })
          })}
        </div>
      }
    </GenericModal>
  )
};

export default SubscriptionModal;