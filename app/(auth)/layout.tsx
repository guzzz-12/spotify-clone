import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";
import { supabaseServerClient } from "@/utils/supabaseServerClient";

interface Props {
  children: ReactNode;
}

const SigninLayout = async ({children}: Props) => {
  const supabase = await supabaseServerClient();
  const {data} = await supabase.auth.getUser();

  if (data.user) {
    return redirect("/", RedirectType.replace);
  }

  return (
    <main className="h-full bg-neutral-800">
      {children}
    </main>
  );
}

export default SigninLayout