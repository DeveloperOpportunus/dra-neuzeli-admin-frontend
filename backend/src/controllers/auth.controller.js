import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../services/supabase.service';
import { signJwt } from '../utils/jwt';

// POST, login do usuário "/login"
export async function login (req, res) {
    try {
        const { email, senha } = req.body || {};
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }
        const emailNorm = String(email).toLowerCase().trim();

        // 1) Busca usuário por email
        const { data: user, error } = await supabaseAdmin
            .from('usuarios')
            .select('id, nome, email, senha_hash, role')
            .eq('email', emailNorm)
            .single();
        // não revelar se o email existe: resposta genérica
        if (error || !user) return res.status(401).json({ error: 'Email ou senha inválidos.' });

        // 2) Compara senha com o hash do banco
        const ok = await bcrypt.compare(senha, user.senha_hash);
        if (!ok) return res.status(401).json({ error: 'Email ou senha inválidos.' });

        // 3) Gera JWT (7d por padrão; ver utils/jwt.js)
        const token = signJwt({ sub: user.id, email: user.email, role: user.role });

        // 4) Nunca exponha senha_hash
        const safeUser = { id: user.id, nome: user.nome, email: user.email, role: user.role };

        return res.json({ token, user: safeUser });
    } catch ( e ) {
        return res.status(500).json({ error: e.message });
    }
}