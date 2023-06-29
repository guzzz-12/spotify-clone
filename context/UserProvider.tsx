"use client"

import { ReactNode, createContext, useEffect, useState } from "react";
import { SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { Subscription, UserDetails } from "@/types";
import { Database } from "@/types/supabase";

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
  const supabase = useSessionContext();
  const supabaseClient: SupabaseClient<Database> = supabase.supabaseClient
  const user = useUser();

  const accessToken = supabase.session?.access_token ?? null;

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

      const {data, error} = await supabaseClient
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trialing", "active"])
      .single();

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