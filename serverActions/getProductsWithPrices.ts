import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

const getProductsWithPrices = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  try {
    const {data, error} = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("active", true)
    .order("unit_amount", {foreignTable: "prices"})

    if (error) {
      throw new Error(error.message);
    };
    
    return data;
    
  } catch (error: any) {
    console.log(`Error consultando productos: ${error.message}`);
    return []
  };
};

export default getProductsWithPrices;