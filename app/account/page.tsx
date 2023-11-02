import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { FaUserCog } from "react-icons/fa";
import Header from "@/components/Header";
import getUserUploadedSongs from "@/serverActions/getUserUploadedSongs";
import AccountsTabs from "./components/AccountsTabs";

const AccountPage = async () => {
  const cookieStore = cookies();

  // Verificar si hay usuario autenticado (server side)
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const userData = await supabase.auth.getUser();

  // Redirigir si no hay usuario
  if (!userData.data.user) {
    return redirect("/")
  };

  /** Consultar las canciones del usuario (sin paginación por ahora) */
  const userSongs = await getUserUploadedSongs(userData.data.user.id);

  return (
    <section className="w-full h-full rounded-lg bg-neutral-900 overflow-hidden overflow-y-auto">
      <Header>
        <div className="flex justify-center items-center gap-3 pb-3 border-b border-neutral-700">
          <FaUserCog className="w-9 h-9 text-neutral-400" />
          <h1 className="text-2xl text-white font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      <AccountsTabs songs={userSongs} />
    </section>
  )
};

export default AccountPage;