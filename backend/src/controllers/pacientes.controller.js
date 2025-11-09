import { supabaseAdmin } from "../services/supabase.service";

// GET, lista todos os pacientes.
export async function listPacientes(req, res) {
    try {
        const {data, error} = await supabaseAdmin
        .from('pacientes')
        .select('*')
        .order("created_at", { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: e.message });
    }
}