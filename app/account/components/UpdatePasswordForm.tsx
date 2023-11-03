"use client"

import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { SupabaseClient } from "@supabase/supabase-js";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { AiFillLock, AiOutlineInfoCircle } from "react-icons/ai";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { Database } from "@/types/supabase";

const PasswordFormSchema = z.object({
  password: z
    .string({required_error: "The password is required"})
    .nonempty("The password is required")
    .min(6, "The password must be at least 6 characters long")
    .max(72, "The password cannot be more than 72 characters long"),
  passwordConfirm: z
    .string({required_error: "You must confirm your password"})
    .nonempty("You must confirm your password")
})
.refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"]
});

const WithOtpFormSchema = z.object({
  otp: z
    .string({required_error: "The confirmation code is required"})
    .nonempty("The confirmation code is required")
    .min(6, "Invalid code")
    .max(6, "Invalid code")
});

// Extender el schema del formulario para validar el campo OTP
// en caso de que el usuario requiera reautenticación
const ExtendedFormType = PasswordFormSchema.and(WithOtpFormSchema);

type passwordFormSchemaType = z.infer<typeof ExtendedFormType>;

interface Props {
  supabase: SupabaseClient<Database>;
  router: AppRouterInstance;
  needsReauthentication: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setShowPasswordForm: Dispatch<SetStateAction<boolean>>;
}

const UpdatePasswordForm = ({supabase, router, needsReauthentication, loading, setLoading, setShowPasswordForm}: Props) => {
  const formProps = useForm<passwordFormSchemaType>({
    resolver: zodResolver(!needsReauthentication ? PasswordFormSchema : ExtendedFormType)
  });

  /** Confirmar el cambio de contraseña */
  const onSubmitHandler = async (values: passwordFormSchemaType) => {
    try {
      setLoading(true);

      const {error} = await supabase.auth.updateUser({
        password: values.password,
        nonce: values.otp
      });

      if (error) {
        throw new Error(error.message)
      }

      formProps.reset();

      router.refresh();

      toast.success("Password updated successfully");

      setLoading(false);
      setShowPasswordForm(false);
      
    } catch (error: any) {
      toast.error(`Error updating password: ${error.message}`);
      setLoading(false);
    }
  }

  return (
    <FormProvider {...formProps}>
      <form
        className="flex flex-col justify-between gap-5 w-full max-w-[600px] mx-auto p-5 rounded-md bg-slate-900"
        noValidate
        onSubmit={formProps.handleSubmit(onSubmitHandler)}
      >
        <div>
          <h2 className="mb-1 text-lg">
            Update your password
          </h2>
          {needsReauthentication &&
            <div className="flex justify-start items-center gap-2 text-neutral-300">
              <AiOutlineInfoCircle className="w-5 h-5" />
              <p className="">
                Check your inbox and copy the 6-digit confirmation code
              </p>
            </div>
          }
        </div>

        <FormInput
          id="password"
          type="password"
          name="password"
          placeholder="******"
          Icon={AiFillLock}
          disabled={loading}
        />

        <FormInput
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          placeholder="******"
          Icon={AiFillLock}
          disabled={loading}
        />

        {needsReauthentication &&
          <FormInput
            id="otp"
            type="text"
            name="otp"
            placeholder="Confirmation code"
            Icon={AiFillLock}
            disabled={loading}
          />
        }

        <div className="flex justify-start items-center gap-2">
          <Button
            className="flex justify-between items-center"
            type="submit"
            disabled={loading}
            onClickHandler={() => null}
          >
            Confirm password change
          </Button>
          <Button
            className="flex justify-between items-center font-normal text-white bg-transparent"
            type="submit"
            disabled={loading}
            onClickHandler={() => setShowPasswordForm(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default UpdatePasswordForm;