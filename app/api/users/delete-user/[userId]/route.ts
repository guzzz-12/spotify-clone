import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/libs/supabaseAdmin";

interface Context {
  params: {
    userId: string;
  }
}

/** Eliminar la cuenta del usuario, su data y sus archivos */
export async function DELETE(req: NextRequest, {params}: Context) {
  try {
    const userId = params.userId;

    if (!userId) {
      return new NextResponse("Invalid User ID", {status: 400})
    }

    // Consultar las canciones del usuario
    const userSongs = await supabaseAdmin
    .from("songs")
    .select("song_path, image_url")
    .eq("user_id", userId);

    // Si tiene canciones, eliminar todos los archivos asociados del storage
    if (userSongs.data && userSongs.data.length > 0) {
      // Extraer los paths de los archivos de las canciones
      const filesPaths = userSongs.data.map(song => {
        return {
          song_path: song.song_path,
          image_path: song.image_url
        }
      });
  
      // Eliminar las canciones del storage
      await supabaseAdmin.storage
      .from("songs")
      .remove(filesPaths.map(el => el.song_path));

      // Eliminar las imágenes del storage
      await supabaseAdmin.storage
      .from("images")
      .remove(filesPaths.map(el => el.image_path));
    }

    // Eliminar la data del usuario de la base de datos
    await supabaseAdmin.from("users").delete().eq("id", userId);

    // Eliminar la cuenta del usuario luego de eliminar toda su data y archivos
    await supabaseAdmin.auth.admin.deleteUser(userId);

    revalidatePath("/account");

    return new NextResponse("User deleted successfully");
    
  } catch (error: any) {
    console.log(`Error eliminando usuario: ${error.message}`)
  }
}