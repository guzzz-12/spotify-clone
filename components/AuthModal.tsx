"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import GenericModal from "./GenericModal"
import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const {session} = useSessionContext();

  const {isOpen, onOpenChange} = useAuthModal();

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
      description="Login to your account"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Auth
        supabaseClient={supabase}
        theme="dark"
        magicLink
        providers={["github", "google"]}
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