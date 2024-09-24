"use client"

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { BsFillShieldLockFill } from "react-icons/bs";
import Button from "@/components/Button";
import DeleteAccountModal from "./DeleteAccountModal";
import { UserContext } from "@/context/UserProvider";
import useCurrentSession from "@/hooks/useCurrentSession";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";

const AccountSecurity = () => {
  const router = useRouter();

  const {clearUserData} = useContext(UserContext);
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = supabaseBrowserClient;

  const {session} = useCurrentSession();

  if (!session) {
    return null;
  }
  
  /** Función para eliminar la cuenta del usuario */
  const onDeleteAccountHandler = async () => {
    try {
      setLoading(true);

      const {data: {user}} = await supabase.auth.getUser();

      if (!user) {
        return null;
      }
      
      await axios({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/api/users/delete-user/${user.id}`,
        withCredentials: true
      });

      await supabase.auth.signOut();

      clearUserData();

      router.replace("/");

      return null;

    } catch (error: any) {
      toast.error(`Error deleting account: ${error.message}`);
      setLoading(false);
      return null;
    }
  }

  return (
    <section className="max-w-[600px] mx-auto p-5 rounded-md border border-red-700 bg-red-800/10">
      <DeleteAccountModal
        isOpen={openDeleteModal}
        isLoading={loading}
        setIsOpen={setOpenDeleteModal}
        confirmHandler={onDeleteAccountHandler}
      />

      <div className="flex justify-center items-center gap-2 w-full mb-4">
        <Tooltip id="back-btn" />
        <BsFillShieldLockFill className="w-6 h-6 text-neutral-400" />
        <h2 className="text-xl">Account Security</h2>
      </div>

      <Button
        className="block mx-auto text-white bg-red-700"
        disabled={loading}
        onClickHandler={() => setOpenDeleteModal(true)}
      >
        Delete account
      </Button>
    </section>
  )
}

export default AccountSecurity;