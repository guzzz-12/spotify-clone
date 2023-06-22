"use client"

import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { Subscription, UserDetails } from "@/types";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  subscription: Subscription | null;
  isLoadingUser: boolean;
  isLoadingSubscription: boolean;
  error: string | null;
};

export const UserContext = createContext<UserContextType>({
  accessToken: null,
  user: null,
  userDetails: null,
  subscription: null,
  isLoadingUser: false,
  isLoadingSubscription: false,
  error: null
});

const UserProvider = ({children}: {children: ReactNode}) => {
  const {session, supabaseClient} = useSessionContext();
  const user = useUser();

  const accessToken = session?.access_token ?? null;

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Consultar los detalles del usuario */
  const getUserDetails = async () => {
    try {
      setIsLoadingUser(true);

      const {data, error} = await supabaseClient
      .from("users")
      .select("*")
      .single<UserDetails>();

      if (error) {
        throw error;
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

      const {data, error} = await supabaseClient
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single<Subscription>();

      if (error) {
        throw error;
      };

      setSubscription(data);
      
    } catch (error: any) {
      setError(error.message)      
    } finally {
      setIsLoadingSubscription(false)
    }
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
        error
      }}
    >
      {children}
    </UserContext.Provider>
  )
};

export default UserProvider;