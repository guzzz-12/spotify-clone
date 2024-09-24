import { supabaseServerClient } from "@/utils/supabaseServerClient";

/** Consultar del lado del servidor si el usuario posee una sesión activa */
const getServerSideSession = async () => {
  const supabase = await supabaseServerClient();
  
  // Consultar la sesión del usuario
  const {data: sessionData, error: sessionError} = await supabase.auth.getSession();
  
  if (sessionError) {
    console.log(sessionError.message);
    return false;
  };
  
  // Si no está autenticado, retornar con error
  if (!sessionData.session) {
    console.log("User must be logged in to perform this action");
    return false;
  };

  return true;
};

export default getServerSideSession;