import { NextRequest, NextResponse } from "next/server";
import getSongs from "@/serverActions/getSongs";

// Endpoint del cron job para realizar una consulta a la base de datos diariamente a la medianoche y así evitar que el proyecto de supabase se inhabilite por inactividad.
export async function GET(req: NextRequest) {
  try {
    if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({message: "Unauthorized cron request"}, {status: 401});
    }

    const songs = await getSongs();

    return NextResponse.json({CRON_JOB_SUCCESS: true, TOTAL_SONGS: songs.length});
  } catch (error: any) {
    console.error({ERROR_DE_CRON_JOB: error.message, error});
  }
}