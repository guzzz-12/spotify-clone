import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/libs/supabaseAdmin";

interface Context {
  params: {
    userId: string;
  }
}

/** Actualizar el nombre y el apellido del usuario en la metadata */
export async function PATCH(req: NextRequest, {params}: Context) {
  try {
    const userId = params.userId;
    const {firstName, lastName} = await req.json() as {firstName: string, lastName: string};

    if (!firstName || !lastName) {
      return new NextResponse("All fields are required", {status: 400})
    }
    
    if (firstName.length < 3 || lastName.length < 3) {
      return new NextResponse("Invalid name or lastname lenght", {status: 400})
    }

    if (!userId) {
      return new NextResponse("Invalid User ID", {status: 400})
    }

    console.log({firstName, lastName});

    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        name: firstName,
        last_name: lastName,
        full_name: firstName + " " + lastName,
      }
    });

    return new NextResponse("User details updated successfully");
    
  } catch (error: any) {
    console.log(`Error actualizando nombre y apellido del usuario: ${error.message}`)
  }
}