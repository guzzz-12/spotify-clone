import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import getSongs from "@/serverActions/getSongs";

export const dynamic = "force-dynamic";

// Endpoint del cron job para realizar una consulta a la base de datos diariamente a la medianoche y así evitar que el proyecto de supabase se inhabilite por inactividad.
export async function GET(_req: NextRequest) {
  try {
    const headerList = headers();

    if (headerList.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({message: "Unauthorized cron request"}, {status: 401});
    }

    const songs = await getSongs();

    return NextResponse.json({CRON_JOB_SUCCESS: true, TOTAL_SONGS: songs.length});
  } catch (error: any) {
    console.error({ERROR_DE_CRON_JOB: error.message, error});
  }
}