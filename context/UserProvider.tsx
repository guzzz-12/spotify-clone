"use client"

import { ReactNode, createContext, useEffect, useState } from "react";
import { SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { UserDetails, SubscriptionWithPricesAndProducts } from "@/types";
import { Database } from "@/types/supabase";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  subscription: SubscriptionWithPricesAndProducts | null;
  isLoadingUser: boolean;
  isLoadingSubscription: boolean;
  error: string | null;
  subscriptionError: PostgrestError | null;
  updateSubscriptionState: (data: SubscriptionWithPricesAndProducts | null) => void;
};

export const UserContext = createContext<UserContextType>({
  accessToken: null,
  user: null,
  userDetails: null,
  subscription: null,
  isLoadingUser: true,
  isLoadingSubscription: false,
  error: null,
  subscriptionError: null,
  updateSubscriptionState: () => {}
});

const UserProvider = ({children}: {children: ReactNode}) => {
  const supabase = useSessionContext();
  const supabaseClient: SupabaseClient<Database> = supabase.supabaseClient
  const user = useUser();

  const accessToken = supabase.session?.access_token ?? null;

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionWithPricesAndProducts | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<PostgrestError | null>(null);

  /** Consultar los detalles del usuario */
  const getUserDetails = async () => {
    try {
      setIsLoadingUser(true);

      const {data, error} = await supabaseClient
      .from("users")
      .select("*")
      .single();

      if (error) {
        throw new Error(error.message);
      };

      const {full_name, first_name} = data;

      // Actualizar el nomre y el apellido si aún no se han actualizado
      if (full_name && !first_name) {
        const first_name = full_name.split(" ")[0];
        const last_name = full_name.split(" ")[1];

        const {data: updatedUserDetails, error: updateUserError} = await supabaseClient
        .from("users")
        .update({first_name, last_name})
        .eq("id", data.id)
        .single();

        if (updateUserError) {
          throw new Error(updateUserError.message)
        }

        return setUserDetails(updatedUserDetails);
      };

      setUserDetails(data);
      
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoadingUser(false)
    }
  };
  
  
  /** Consultar la suscripción del usuario */
  const getUserSubscription = async () => {
    try {
      setIsLoadingSubscription(true);

      const {data, error: subscriptionError} = await supabaseClient
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();

      // Si no posee suscripción, mostrar el modal de suscripción
      if (subscriptionError) {
        if (subscriptionError.code === "PGRST116") {
          return setSubscriptionError(subscriptionError)
        };

        throw new Error(subscriptionError.message)
      };

      setSubscription(data);
      
    } catch (error: any) {
      setError(error.message)      
    } finally {
      setIsLoadingSubscription(false)
    }
  };


  /** Actualizar el state de la suscripción desde otros componentes */
  const updateSubscriptionState = (data: SubscriptionWithPricesAndProducts | null) => {
    setSubscription(data);
  };


  useEffect(() => {
    getUserDetails();
    getUserSubscription();
  }, []);


  return (
    <UserContext.Provider
      value={{
        accessToken,
        user,
        userDetails,
        subscription,
        isLoadingUser,
        isLoadingSubscription,
        error,
        subscriptionError,
        updateSubscriptionState
      }}
    >
      {children}
    </UserContext.Provider>
  )
};

export default UserProvider;