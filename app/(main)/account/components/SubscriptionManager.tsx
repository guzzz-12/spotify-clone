"use client"

import { useContext } from "react";
import Button from "@/components/Button";
import useSubscriptionModal from "@/hooks/useSubscriptionModal";
import { UserContext } from "@/context/UserProvider";

const SubscriptionManager = () => {
  const {subscription, isLoadingSubscription} = useContext(UserContext);

  const subscriptionModal = useSubscriptionModal();

  return (
    <section className="w-full max-w-[600px] mx-auto px-4 py-8 bg-slate-900 rounded-md">
      {!isLoadingSubscription && !subscription && (
        <div className="flex flex-col justify-center items-center">
          <p className="mb-1 text-center text-xl">
            You currently don't have any active subscription
          </p>
          <p className="mb-6 text-center text-sm text-gray-400 font-semibold">
            Subscribe to create and share your song libraries
          </p>
          <Button
            className="w-[300px]"
            onClickHandler={() => subscriptionModal.onOpenChange(true, true)}
          >
            Subscribe
          </Button>
        </div>
      )}

      {subscription &&
        <div className="flex flex-col justify-center items-center">
          <p className="mb-1 text-center text-xl">
            You are currently subscribed to {subscription.prices?.products?.name}
          </p>
          <p className="mb-6 text-center text-sm text-gray-400 font-semibold">
            You can update or cancel your subscription anytime
          </p>
          <Button
            className="w-[300px]"
            onClickHandler={subscriptionModal.onOpenChange.bind(null, true)}
          >
            Update or cancel your subscription
          </Button>
        </div>
      }
    </section>
  )
};

export default SubscriptionManager;