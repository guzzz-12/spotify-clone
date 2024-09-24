"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FaSpotify } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import { MdMailOutline } from "react-icons/md";
import Alert from "@/components/Alert";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";
import { UserContext } from "@/context/UserProvider";
import { cn } from "@/lib/utils";

const AuthFormSchema = z.object({
  email: z
    .string()
    .min(1, {message: "The email is required"})
    .email({message: "Invalid email address"})
});

type AuthFormType = z.infer<typeof AuthFormSchema>;

const AuthPage = () => {
  const searchParams = useSearchParams();

  const isSignup = !!(searchParams.get("new_account") === "true");

  const {isLoadingUser} = useContext(UserContext);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const formProps = useForm<AuthFormType>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: ""
    }
  });

  const supabase = supabaseBrowserClient;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Iniciar sesión o regstrarse con google o github
  const onSocialSubmitHandler = async (provider: "google" | "github") => {
    try {
      setLoading(true);

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL!}/api/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          }
        }
      });

    } catch (error: any) {
      toast.error(error.message, {duration: 10000});
      setLoading(false);
    }
  }

  /** Iniciar sesión o registrarse con magic link */
  const onSubmitHandler = async (values: AuthFormType) => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(false);

      const { error } = await supabaseBrowserClient.auth.signInWithOtp({
        email: values.email,
        options: {
          shouldCreateUser: true,
          // Redirigir a este endpoint para verificar el hash de autenticación del magic link
          emailRedirectTo: process.env.NEXT_PUBLIC_PROJECT_URL!
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
      setLoading(false);
      formProps.reset();
      
    } catch (error: any) {
      toast.error(error.message, {duration: 10000});
      setLoading(false);
      setError(true);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <section className="relative flex justify-center items-center min-h-screen p-5 text-center">
      {isLoadingUser &&
        <Spinner />
      }

      {!isLoadingUser &&
        <section className="w-full max-w-[450px] text-white">
          <Link href="/">
            <div className="flex justify-center items-center gap-3 mb-3">
              <FaSpotify className="text-green-600" size={45} />
              
              <Typography variant="h2" text="Spotify Clone" />
            </div>
          </Link>

          <Typography
            className="mb-1 text-xl font-semibold"
            variant="p"
            text={isSignup ? "Create New Account" : "Sign in to your Spotify account"}
          />

          <div className="flex flex-col gap-2 mt-4">
            <Button
              className="relative py-6 text-white bg-neutral-950 hover:text-white hover:bg-neutral-900"
              disabled={loading}
              onClick={() => onSocialSubmitHandler("google")}
            >
              <FcGoogle
                className="absolute left-4 top-[50%] translate-y-[-50%] z-10"
                size={30}
              />
              <Typography
                className="mx-auto text-lg"
                variant="p"
                text={isSignup ? "Signup with Google" : "Sign in with Google"}
              />
            </Button>

            <Button
              className="relative py-6 text-white bg-neutral-950 hover:text-white hover:bg-neutral-900"
              disabled={loading}
            >
              <RxGithubLogo
                className="absolute left-4 top-[50%] translate-y-[-50%] z-10"
                size={30}
              />
              <Typography
                className="mx-auto text-lg"
                variant="p"
                text={isSignup ? "Signup with Github" : "Sign in with Github"}
              />
            </Button>
          </div>

          <div className="flex justify-between items-center gap-4 my-4">
            <div className="w-full h-[1px] bg-border" />
            <Typography text="OR" variant="p" />
            <div className="w-full h-[1px] bg-border" />
          </div>

          <Form {...formProps}>
            <form
              className="flex flex-col gap-3"
              onSubmit={formProps.handleSubmit(onSubmitHandler)}
            >
              <FormField
                name="email"
                control={formProps.control}
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={cn("py-5", formProps.formState.errors.email ? "border-destructive" : "border")}
                        placeholder="john.doe@mail.com"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-left translate-y-[-5px]" />
                  </FormItem>
                )}
              />

              {success &&
                <Alert
                  className="bg-neutral-950"
                  type="success"
                  title="A sign in link has been sent. Check your inbox."
                  subtitle="Check your spam folder if you don't see it."
                />
              }

              {error &&
                <Alert
                  className="bg-neutral-950"
                  type="error"
                  title="Error sending the sign in link."
                  subtitle="Refresh the page and try again after a couple of minutes."
                />
              }

              <Button
                className="relative py-6 text-white bg-neutral-950 hover:text-white hover:bg-neutral-900"
                disabled={loading}
              >
                <MdMailOutline
                  className="absolute left-4 top-[50%] translate-y-[-50%] z-10"
                  size={30}
                />
                <Typography 
                  className="text-lg"
                  text={isSignup ? "Signup with email" : "Sign in with email"}
                  variant="p"
                />
              </Button>
            </form>
          </Form>
        </section>
      }
    </section>
  )
}

export default AuthPage