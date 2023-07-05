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
        <div className="flex flex-col justify-center items-center gap-4">
          <p>No active subscription</p>
          <Button
            className="w-[300px]"
            onClickHandler={() => subscriptionModal.onOpenChange(true, true)}
          >
            Subscribe
          </Button>
        </div>
      )}

      {subscription &&
        <div className="flex flex-col justify-center items-center gap-4">
          <p>
            You are currently subscribed to {subscription.prices?.products?.name}
          </p>
          <Button
            className="w-[300px]"
            onClickHandler={subscriptionModal.onOpenChange.bind(null, true)}
          >
            Update or cancel subscription
          </Button>
        </div>
      }
    </section>
  )
};

export default AccountContent;