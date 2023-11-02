"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import GenericModal from "./GenericModal"
import useAuthModal from "@/hooks/useAuthModal";
import { Database } from "@/types/supabase";

const AuthModal = () => {
  const router = useRouter();

  const supabase = useSessionContext();
  const session = supabase.session;
  const supabaseClient: SupabaseClient<Database> = supabase.supabaseClient;

  const {isOpen, authType, onOpenChange} = useAuthModal();

  // Cerrar el modal al iniciar sesión
  useEffect(() => {
    if (session) {
      router.refresh();
      onOpenChange(false);
    }
  }, [session, router, onOpenChange]);

  return (
    <GenericModal
      title="Welcome back"
      description="Sign in or create new account"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Auth
        supabaseClient={supabaseClient}
        theme="dark"
        magicLink
        view={authType}
        providers={["github", "google"]}
        redirectTo={process.env.NEXT_PUBLIC_SITE_URL}
        queryParams={{
          prompt: "consent"
        }}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#141414"
              }
            }
          }
        }}
      />
    </GenericModal>
  )
};

export default AuthModal;