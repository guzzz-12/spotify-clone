"use client"

import { ReactNode, createContext, useEffect, useState } from "react";
import { PostgrestError, User } from "@supabase/supabase-js";
import useCurrentSession from "@/hooks/useCurrentSession";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";
import { UserDetails, SubscriptionWithPricesAndProducts } from "@/types";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  subscription: SubscriptionWithPricesAndProducts | null;
  clearUserData: () => void;
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
  clearUserData: () => {},
  error: null,
  subscriptionError: null,
  updateSubscriptionState: () => {}
});

const UserProvider = ({children}: {children: ReactNode}) => {
  const supabase = supabaseBrowserClient;
  const session = useCurrentSession(state => state.session);

  const accessToken = session?.access_token ?? null;

  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionWithPricesAndProducts | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<PostgrestError | null>(null);
  
  // Inicializar el state de la data del usuario
  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  /** Consultar los detalles del usuario en la base de datos */
  const getUserDetails = async () => {
    try {
      setIsLoadingUser(true);

      const {data: userData, error} = await supabase
      .from("users")
      .select("*")
      .limit(1);

      if (error) {
        throw new Error(error.message);
      };

      const {id, full_name, first_name} = userData[0];

      // Actualizar el nomre y el apellido si aún no se han actualizado
      if (full_name && !first_name) {
        const first_name = full_name.split(" ")[0];
        const last_name = full_name.split(" ")[1];

        const {data: updatedUserDetails, error: updateUserError} = await supabase
        .from("users")
        .update({first_name, last_name})
        .eq("id", id)
        .single();

        if (updateUserError) {
          throw new Error(updateUserError.message)
        }

        return setUserDetails(updatedUserDetails);
      };

      setUserDetails(userData[0]);
      
    } catch (error: any) {
      setError(error.message);

    } finally {
      setIsLoadingUser(false);
    }
  };
  
  
  /** Consultar la suscripción del usuario */
  const getUserSubscription = async () => {
    try {
      setIsLoadingSubscription(true);

      const {data: subscriptionData, error: subscriptionError} = await supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .limit(1);

      // Si no posee suscripción, mostrar el modal de suscripción
      if (subscriptionError) {
        if (subscriptionError.code === "PGRST116") {
          return setSubscriptionError(subscriptionError)
        };

        throw new Error(subscriptionError.message)
      };

      setSubscription(subscriptionData[0]);
      
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


  /** Eliminar la data del usuario del state global */
  const clearUserData = () => {
    setUser(null);
    setUserDetails(null);
  }


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
        clearUserData,
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