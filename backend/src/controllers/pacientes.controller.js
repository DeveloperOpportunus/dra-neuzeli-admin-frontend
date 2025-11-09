import { supabaseAdmin } from "../services/supabase.service.js";

const onlyDigits = (v) => {
  if (v == null) return v;                  // mantém null/undefined
  const s = String(v);
  return s.replace(/\D+/g, "");
};
const nz = (v) => (v === "" || v === undefined ? null : v); // ""/undefined -> null


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
    const body = req.body ?? {};
    const { dadosPessoais = {}, perimetria = {}, bioimpedancia = {} } = body;

    // -------- Validação: apenas os 4 obrigatórios --------
    const nome = dadosPessoais?.nome?.trim();
    const email = dadosPessoais?.email?.trim()?.toLowerCase();
    const telefone = (dadosPessoais?.telefone || "").trim(); // deve chegar "55..."
    const cpf = onlyDigits(dadosPessoais?.cpf);

    if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });
    if (!email) return res.status(400).json({ error: "Email é obrigatório." });
    if (!telefone) return res.status(400).json({ error: "Telefone é obrigatório." });
    if (!cpf) return res.status(400).json({ error: "CPF é obrigatório." });

    // Checagens leves (pode relaxar se quiser)
    if (!/^55\d{10,11}$/.test(telefone)) {
      return res.status(400).json({ error: "Telefone deve começar com 55 + DDD + número (ex.: 5521999999999)." });
    }
    if (!/^\d{11}$/.test(cpf)) {
      return res.status(400).json({ error: "CPF deve ter 11 dígitos." });
    }

    // -------- Métricas (derivadas do front) --------
    const altura_cm = dadosPessoais.altura_cm ?? null;
    const peso_kg   = dadosPessoais.peso_kg ?? null;

    // ================== 1) PACIENTE ==================
    const { data: paciente, error: errPac } = await supabaseAdmin
      .from("pacientes")
      .insert({
        nome,
        email,
        telefone, // ex.: "5521999987326"
        data_nascimento: nz(dadosPessoais.dataNascimento),
        sexo: nz(dadosPessoais.sexo),
        cpf: nz(cpf),
        logradouro: nz(dadosPessoais.logradouro),
        numero: nz(dadosPessoais.numero),
        complemento: nz(dadosPessoais.complemento),
        bairro: nz(dadosPessoais.bairro),
        cidade: nz(dadosPessoais.cidade),
        estado: nz(dadosPessoais.estado),
        cep: nz(onlyDigits(dadosPessoais.cep)),
        plano_saude: nz(dadosPessoais.planoSaude),
        numero_carteira: nz(dadosPessoais.numeroCarteira),
        observacoes: nz(dadosPessoais.observacoes),
        altura_cm: nz(altura_cm),
        peso_kg: nz(peso_kg),
        status: "ativo", // opcional
      })
      .select("*")
      .single();

    if (errPac) return res.status(400).json({ error: errPac.message });

    const pacienteId = paciente.id;

    // ================== 2) PERIMETRIA ==================
    if (perimetria && Object.keys(perimetria).length > 0) {
      const { error: errPer } = await supabaseAdmin
        .from("perimetria")
        .insert({
          paciente_id: pacienteId,
          data_avaliacao: nz(perimetria.dataAvaliacao) ?? new Date().toISOString(),
          pescoco_cm: nz(perimetria.pescoco),
          ombro_cm: nz(perimetria.ombro),
          torax_cm: nz(perimetria.torax ?? perimetria.peitoral),
          cintura_cm: nz(perimetria.cintura ?? perimetria.umbigo),
          abdomen_cm: nz(perimetria.abdomen ?? perimetria.abdomenInferior),
          quadril_cm: nz(perimetria.quadril),
          braco_dir_cm: nz(perimetria.bracoDireito),
          braco_esq_cm: nz(perimetria.bracoEsquerdo),
          antebraco_dir_cm: nz(perimetria.antebracoDireito),
          antebraco_esq_cm: nz(perimetria.antebracoEsquerdo),
          coxa_dir_cm: nz(perimetria.coxaDireita),
          coxa_esq_cm: nz(perimetria.coxaEsquerda),
          panturrilha_dir_cm: nz(perimetria.panturrilhaDireita ?? perimetria.panturrilha),
          panturrilha_esq_cm: nz(perimetria.panturrilhaEsquerda),
          observacoes: nz(perimetria.observacoes),
        });

      if (errPer) {
        // rollback simples
        await supabaseAdmin.from("pacientes").delete().eq("id", pacienteId);
        return res.status(400).json({ error: errPer.message });
      }
    }

    // ================== 3) BIOIMPEDÂNCIA ==================
    if (bioimpedancia && Object.keys(bioimpedancia).length > 0) {
      const { error: errBio } = await supabaseAdmin
        .from("bioimpedancia")
        .insert({
          paciente_id: pacienteId,
          data_avaliacao: nz(bioimpedancia.dataAvaliacao) ?? new Date().toISOString(),
          peso_kg: nz(bioimpedancia.peso),
          imc: nz(bioimpedancia.imc),
          gordura_percent: nz(bioimpedancia.gorduraPercent),
          massa_magra_kg: nz(bioimpedancia.massaMagra),
          massa_muscular_esqueletica_kg: nz(bioimpedancia.massaMuscularEsqueletica),
          agua_percent: nz(bioimpedancia.aguaPercent),
          tmb_kcal: nz(bioimpedancia.tmb),
          idade_corporal: nz(bioimpedancia.idadeMetabolica),
          gordura_visceral: nz(bioimpedancia.gorduraVisceral),
          angulo_fase: nz(bioimpedancia.anguloFase),
          observacoes: nz(bioimpedancia.observacoes),
        });

      if (errBio) {
        await supabaseAdmin.from("pacientes").delete().eq("id", pacienteId);
        return res.status(400).json({ error: errBio.message });
      }
    }

    // OK
    return res.status(201).json(paciente);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Erro interno" });
  }
}