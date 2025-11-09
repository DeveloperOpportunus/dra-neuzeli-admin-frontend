import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

if (!url || !serviceRoleKey) {
  throw new Error("Supabase URL ou Service Role Key não foi definida nas variáveis de ambiente.");
}

// serice role ignora RLS
export const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: {
        persistSession: false,
    },
});


async function ping() {
  try {
    const { data, error } = await supabaseAdmin.from("pacientes").select("id").limit(1);
    if (error) console.error("Supabase ping error:", error.message);
    else console.log("Supabase ping ok:", data?.length ?? 0);
  } catch (e) {
    console.error("Supabase ping exception:", e.message);
  }
}
ping();