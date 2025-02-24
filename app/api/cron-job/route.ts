import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import sendgrid from "@sendgrid/mail";
import getSongs from "@/serverActions/getSongs";
import { cronJobEmailTemplate } from "@/utils/cronJobEmailTemplate";

export const dynamic = "force-dynamic";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

// Endpoint del cron job para realizar una consulta a la base de datos diariamente a la medianoche y así evitar que el proyecto de supabase se inhabilite por inactividad.
export async function GET(_req: NextRequest) {
  try {
    const headerList = headers();

    if (headerList.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized cron request" }, { status: 401 });
    }

    const songs = await getSongs();

    const data = { CRON_JOB_SUCCESS: true, TOTAL_SONGS: songs.length };

    console.log({ CRON_JOB_DATA: data });

    // Opciones del correo a enviar
    const mailContent = {
      to: process.env.EMAIL as string,
      from: {
        name: "Spotify Clone App",
        email: process.env.EMAIL as string,
      },
      subject: "Resultados del cron job",
      html: cronJobEmailTemplate(data)
    };

    // Enviar el email de invitación
    await sendgrid.send(mailContent);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error({ ERROR_DE_CRON_JOB: error.message, error });

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}