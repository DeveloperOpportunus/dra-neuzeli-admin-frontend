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

