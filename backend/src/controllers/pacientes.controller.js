import { supabaseAdmin } from "../services/supabase.service.js";

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

// GET, retorna paciente por ID
export async function getPaciente(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
        .from('pacientes')
        .select('*')
        .eq('id', id)
        .single();

        if (error || !data) return res.status(400).json({ error: 'Paciente não encontrado.' });
        res.json(data);

    } catch ( e ) {
        res.status(500).json({ error: e.message });
    }
}

// POST, cria um novo paciente.
export async function createPaciente(req, res) {
    try {
        // i'dont know wtf is this but someday i'll figure it out
        const payload = req.body ?? [];
        
        const { data, error } = await supabaseAdmin
        .from('pacientes')
        .insert(payload)
        .select()
        .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json(data);
    } catch ( e ) {
        res.status(500).json({ error: e.message });
    }
}