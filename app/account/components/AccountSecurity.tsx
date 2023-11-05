"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { BsFillShieldLockFill } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";
import Button from "@/components/Button";
import UpdatePasswordForm from "./UpdatePasswordForm";
import DeleteAccountModal from "./DeleteAccountModal";
import { Database } from "@/types/supabase";

const AccountSecurity = () => {
  const router = useRouter();

  const supabase = useSupabaseClient<Database>();
  const session = useSession();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return null;
  }

  const userProvider = session.user.app_metadata.provider;

  // @ts-ignore
  const sessionIat = session.user.iat as number;
  // Edad de la sesión en segundos
  const sessionDate = (Date.now() - sessionIat * 1000) / 1000;
  // Si la sesión tiene más de 24 horas, solicitar el código de confirmación
  const needsReauthentication = sessionDate >= 24*3600;
  

  /** Iniciar el proceso de cambio de contraseña */
  const onUpdatePasswordHandler = async () => {
    try {
      setLoading(true);
      
      // Enviar el código de confirmación al correo si la sesión tiene más de 24 horas
      if (needsReauthentication) {
        await supabase.auth.reauthenticate();
      }
      
      setShowPasswordForm(true);
      setLoading(false);
      
    } catch (error: any) {
      setLoading(false);
      setShowPasswordForm(false);
      toast.error(`Eror updating password: ${error.message}`);
    }
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/delete-user/${user.id}`,
        withCredentials: true
      });

      await supabase.auth.signOut();

      router.replace("/");

      return null;

    } catch (error: any) {
      toast.error(`Error deleting account: ${error.message}`);
      setLoading(false);
      return null;
    }
  }

  return (
    <section>
      <DeleteAccountModal
        isOpen={openDeleteModal}
        isLoading={loading}
        setIsOpen={setOpenDeleteModal}
        confirmHandler={onDeleteAccountHandler}
      />

      <div className="flex justify-center items-center gap-2 w-full mb-4">
        <Tooltip id="back-btn" />
        <AnimatePresence>
          {showPasswordForm &&
            <motion.div
              initial={{scale: 0.1, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
            >
              <Button
                className="flex justify-center items-center w-8 h-8 p-1 rounded-full"
                data-tooltip-id="back-btn"
                data-tooltip-content="Back to settings"
                onClickHandler={() => setShowPasswordForm(false)}
              >
                <MdArrowBack className="w-6 h-6" />
              </Button>
            </motion.div>
          }
        </AnimatePresence>
        <BsFillShieldLockFill className="w-6 h-6 text-neutral-400" />
        <h2 className="text-xl">Account Security</h2>
      </div>

      {!showPasswordForm &&
        <div className="flex justify-center items-center gap-3 w-full">
          {userProvider === "email" && 
            <Button
              disabled={loading}
              onClickHandler={onUpdatePasswordHandler}
            >
              Change Password
            </Button>
          }
          <Button
            disabled={loading}
            onClickHandler={() => setOpenDeleteModal(true)}
          >
            Delete account
          </Button>
        </div>
      }

      <AnimatePresence>
        {showPasswordForm && userProvider === "email" &&
          <UpdatePasswordForm
            supabase={supabase}
            router={router}
            needsReauthentication={needsReauthentication}
            loading={loading}
            setLoading={setLoading}
            setShowPasswordForm={setShowPasswordForm}
          />
        }
      </AnimatePresence>
    </section>
  )
}

export default AccountSecurity;