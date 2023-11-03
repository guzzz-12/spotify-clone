"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { MdOutlineBadge } from "react-icons/md";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

const UserNameFormSchema = z.object({
  firstName: z
    .string({required_error: "The name is required"})
    .nonempty("The name is required")
    .min(3, "The name must be at least 3 characters long")
    .max(40, "The name cannot be longer than 40 characters"),
  lastName: z
    .string({required_error: "The lastname is required"})
    .nonempty("The last name is required")
    .min(3, "The last name must be at least 3 characters long")
    .max(40, "The last name cannot be longer than 40 characters"),
});

type formSchemaType = z.infer<typeof UserNameFormSchema>;

const UpdateUserNameForm = () => {
  const router = useRouter();

  const session = useSession();

  const [loading, setLoading] = useState(false);

  const formProps = useForm<formSchemaType>({resolver: zodResolver(UserNameFormSchema)});

  /** Confirmar los cambios */
  const onSubmitHandler = async (values: formSchemaType) => {
    if (!session) {
      return false;
    }

    try {
      const userId = session.user.id;
      setLoading(true);

      await axios({
        method: "PATCH",
        url: `/api/users/update-user-details/${userId}`,
        data: {
          firstName: values.firstName,
          lastName: values.lastName
        },
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      setLoading(false);
      formProps.reset();
      toast.success("Details updated successfully");
      router.refresh();
      
    } catch (error: any) {
      toast.error(`Error saving changes: ${error.message}`)
      setLoading(false);
    }
  }

  return (
    <FormProvider {...formProps}>
      <div className="flex justify-center items-center gap-2 w-full mb-4">
        <MdOutlineBadge className="w-6 h-6 text-neutral-400" />
        <h2 className="text-xl">Update Personal Details</h2>
      </div>

      <form
        className="flex flex-col justify-between gap-5 w-full max-w-[600px] mx-auto p-5 rounded-md bg-slate-900"
        noValidate
        onSubmit={formProps.handleSubmit(onSubmitHandler)}
      >
        <h2 className="mb-1 text-lg">
          Update your name and lastname
        </h2>

        <FormInput
          id="firstName"
          type="text"
          name="firstName"
          placeholder="Your first name"
          Icon={MdOutlineBadge}
          disabled={loading}
        />

        <FormInput
          id="lastName"
          type="text"
          name="lastName"
          placeholder="Your last name"
          Icon={MdOutlineBadge}
          disabled={loading}
        />

        <Button
          className="flex justify-between items-center"
          type="submit"
          disabled={loading}
          onClickHandler={() => null}
        >
          Confirm changes
        </Button> 
      </form>
    </FormProvider>
  )
};

export default UpdateUserNameForm;