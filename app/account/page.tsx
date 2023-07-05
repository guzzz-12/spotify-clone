import { redirect } from "next/navigation";
import Header from "@/components/Header";
import AccountContent from "./components/AccountContent";
import getServerSideSession from "@/serverActions/getServerSideSession";

const AccountPage = async () => {
  const isAuth = await getServerSideSession();

  if (!isAuth) {
    return redirect("/")
  };

  return (
    <section className="w-full h-full rounded-lg bg-neutral-900 overflow-hidden overflow-y-auto">
      <Header>
        <div className="flex flex-col gap-6 mb-2">
          <h1 className="text-2xl text-white font-semibold">
            Account settings
          </h1>
        </div>
      </Header>
      <AccountContent />
    </section>
  )
};

export default AccountPage;