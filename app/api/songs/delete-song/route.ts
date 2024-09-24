import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabaseServerClient";

/** Eliminar una canción de la base de datos y sus archivos asociados del storage */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const songId = searchParams.get("song_id");

    if (!songId || !isFinite(+songId)) {
      return NextResponse.json({message: "The requested song does not exist"}, {status: 404});
    }

    const supabase = await supabaseServerClient();

    const {data, error} = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const {data: deletedSong, error: deletedError} = await supabase
      .from("songs")
      .delete()
      .eq("id", +songId)
      .select("*")
      .single()

    if (deletedError) {
      throw new Error(deletedError.message);
    }
  
    if (!deletedSong) {
      return NextResponse.json({message: "The requested song does not exist"}, {status: 404});
    }

    // Eliminar la canción del storage
    await supabase
      .storage
      .from("songs")
      .remove([deletedSong.song_path]);

    // Eliminar la imagen de la canción
    await supabase
      .storage
      .from("images")
      .remove([deletedSong.image_url]);

    return NextResponse.json("Song deleted successfully");

  } catch (error: any) {
    console.log(`Error eliminando canción o sus archivos asociados: ${error.message}`);
    return new NextResponse("Internal server error", {status: 500});
  }
}