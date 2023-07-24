"use client"

import { useContext } from "react";
import Button from "@/components/Button";
import useSubscriptionModal from "@/hooks/useSubscriptionModal";
import { UserContext } from "@/context/UserProvider";

const AccountContent = () => {
  const {subscription, isLoadingSubscription} = useContext(UserContext);

  const subscriptionModal = useSubscriptionModal();

  return (
    <section className="mb-7 px-6">
      {!isLoadingSubscription && !subscription && (
        <div className="flex flex-col justify-center items-center mt-4">
          <p className="mb-1 text-center text-xl">
            You currently don't have any active subscription
          </p>
          <p className="mb-6 text-center text-sm text-gray-200">
            Subscribe to create and share your libraries
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
        <div className="flex flex-col justify-center items-center mt-4">
          <p className="mb-1 text-center text-xl">
            You are currently subscribed to {subscription.prices?.products?.name}
          </p>
          <p className="mb-6 text-center text-sm text-gray-200">
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

export default AccountContent;