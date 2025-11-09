// src/pages/pacientes/DetalhePaciente.tsx
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { ENDPOINTS, API_BASE_URL, authHeaders } from "@/config/api";
import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ---- helpers de formatação (apenas para exibição) ----
const maskCPF = (v?: string | null) => {
  if (!v) return "-";
  const d = String(v).replace(/\D+/g, "").padStart(11, "0").slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};
const prettyPhone = (digits?: string | null) => {
  if (!digits) return "-";
  // espera "55 + DDD + numero"
  const d = digits.replace(/\D+/g, "");
  if (!d.startsWith("55") || d.length < 13) return digits;
  const country = d.slice(0, 2); // 55
  const ddd = d.slice(2, 4);
  const rest = d.slice(4);
  // 9 dígitos no BR: 9xxxx-xxxx
  const part1 = rest.length === 9 ? rest.slice(0, 5) : rest.slice(0, 4);
  const part2 = rest.length === 9 ? rest.slice(5) : rest.slice(4);
  return `+${country} (${ddd}) ${part1}-${part2}`;
};


const prettyDate = (value?: string | null) => {
  if (!value) return "-";

  // 1) "YYYY-MM-DD" (date puro)
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [, y, mo, d] = m;
    return `${d}/${mo}/${y}`;
  }

  // 2) ISO com 'Z' (UTC) -> formata em UTC pra não "voltar um dia"
  if (/Z$/.test(value)) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(d);
  }

  // 3) fallback
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR");
};

const calcIdade = (value?: string | null) => {
  if (!value) return null;

  // "YYYY-MM-DD" (date puro)
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  let birth: Date;
  if (m) {
    const [_, y, mo, d] = m;
    // cria como local-sem-hora, evitando TZ
    birth = new Date(Number(y), Number(mo) - 1, Number(d));
  } else if (/Z$/.test(value)) {
    // ISO-UTC -> usa UTC para extrair Y/M/D
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    birth = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  } else {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    birth = d;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const mDiff = today.getMonth() - birth.getMonth();
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

type Paciente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  data_nascimento?: string | null;
  sexo?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
  plano_saude?: string | null;
  numero_carteira?: string | null;
  altura_cm?: number | null;
  peso_kg?: number | null;
  observacoes?: string | null;
};

type Perimetria = {
  id: number;
  paciente_id: number;
  data_avaliacao?: string | null;
  pescoco_cm?: number | null;
  ombro_cm?: number | null;
  torax_cm?: number | null;
  cintura_cm?: number | null;
  abdomen_cm?: number | null;
  quadril_cm?: number | null;
  braco_dir_cm?: number | null;
  braco_esq_cm?: number | null;
  antebraco_dir_cm?: number | null;
  antebraco_esq_cm?: number | null;
  coxa_dir_cm?: number | null;
  coxa_esq_cm?: number | null;
  panturrilha_dir_cm?: number | null;
  panturrilha_esq_cm?: number | null;
  observacoes?: string | null;
};

type Bio = {
  id: number;
  paciente_id: number;
  data_avaliacao?: string | null;
  peso_kg?: number | null;
  imc?: number | null;
  gordura_percent?: number | null;
  massa_magra_kg?: number | null;
  massa_muscular_esqueletica_kg?: number | null;
  agua_percent?: number | null;
  tmb_kcal?: number | null;
  idade_corporal?: number | null;
  gordura_visceral?: number | null;
  angulo_fase?: number | null;
  observacoes?: string | null;
};

const DetalhePaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [perimetria, setPerimetria] = useState<Perimetria | null>(null);
  const [bio, setBio] = useState<Bio | null>(null);

  useEffect(() => {
    if (!id) return;
    let abort = false;

    async function fetchAll() {
      setLoading(true);
      setErro(null);
      try {
        // 1) Paciente
        const res = await fetch(ENDPOINTS.pacienteById(String(id)), {
          headers: { ...authHeaders() },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Falha ao carregar paciente");
        if (abort) return;
        setPaciente(data);

        // 2) (Opcional) última perimetria
        try {
          const perRes = await fetch(
            `${API_BASE_URL}/api/perimetria?paciente_id=${id}&limit=1&order=desc`,
            { headers: { ...authHeaders() } }
          );
          if (perRes.ok) {
            const perArr = await perRes.json();
            if (!abort && Array.isArray(perArr) && perArr.length) {
              setPerimetria(perArr[0]);
            }
          }
        } catch {
          // se rota não existir, ignora
        }

        // 3) (Opcional) última bioimpedância
        try {
          const bioRes = await fetch(
            `${API_BASE_URL}/api/bioimpedancia?paciente_id=${id}&limit=1&order=desc`,
            { headers: { ...authHeaders() } }
          );
          if (bioRes.ok) {
            const bioArr = await bioRes.json();
            if (!abort && Array.isArray(bioArr) && bioArr.length) {
              setBio(bioArr[0]);
            }
          }
        } catch {
          // se rota não existir, ignora
        }
      } catch (e: any) {
        if (!abort) setErro(e?.message ?? "Erro ao carregar paciente");
      } finally {
        if (!abort) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      abort = true;
    };
  }, [id]);

  const idade = useMemo(() => calcIdade(paciente?.data_nascimento ?? undefined), [paciente]);

  // dados do gráfico (se houver bio + peso)
  const grafico = useMemo(() => {
    if (!bio) return null;
    const gordura = bio.gordura_percent ?? null;
    const peso = bio.peso_kg ?? paciente?.peso_kg ?? null;
    const massaMagraKg = bio.massa_magra_kg ?? null;

    if (gordura == null || peso == null || peso <= 0) return null;

    const magraPercent = massaMagraKg != null ? (massaMagraKg / peso) * 100 : null;
    const outros =
      magraPercent != null ? Math.max(0, 100 - gordura - magraPercent) : null;

    const arr = [];
    arr.push({ nome: "Gordura", valor: Number(gordura) });
    if (magraPercent != null) arr.push({ nome: "Massa magra", valor: Number(magraPercent) });
    if (outros != null) arr.push({ nome: "Outros", valor: Number(outros) });
    return arr;
  }, [bio, paciente?.peso_kg]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">Carregando paciente...</div>
      </MainLayout>
    );
  }

  if (erro || !paciente) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="mb-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/pacientes")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-destructive">
            {erro || "Paciente não encontrado."}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/pacientes")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{paciente.nome}</h1>
            <p className="text-muted-foreground mt-1">Informações completas do paciente</p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/pacientes/${paciente.id}/editar`)}>Editar</Button>
        </div>

        {/* faixa principal */}
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/10">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade</p>
                  <p className="font-semibold">{idade != null ? `${idade} anos` : "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm break-all">{paciente.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-semibold">{prettyPhone(paciente.telefone)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bairro</p>
                  <p className="font-semibold">{paciente.bairro || "-"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{maskCPF(paciente.cpf)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sexo</p>
                  <p className="font-medium">{paciente.sexo || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nascimento</p>
                  <p className="font-medium">{prettyDate(paciente.data_nascimento)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plano de Saúde</p>
                  <p className="font-medium">{paciente.plano_saude || "-"}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">
                    {paciente.logradouro || "-"}
                    {paciente.numero ? `, ${paciente.numero}` : ""}
                    {paciente.complemento ? ` - ${paciente.complemento}` : ""}
                  </p>
                  <p className="font-medium">
                    {(paciente.bairro || "-")} • {(paciente.cidade || "-")}/{paciente.estado || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {paciente.cep || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Altura</p>
                  <p className="font-medium">{paciente.altura_cm != null ? `${paciente.altura_cm} cm` : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="font-medium">{paciente.peso_kg != null ? `${paciente.peso_kg} kg` : "-"}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium">{paciente.observacoes || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bioimpedância (se houver) */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Bioimpedância</CardTitle>
              <CardDescription>
                {bio ? `Avaliação: ${prettyDate(bio.data_avaliacao)}` : "Sem registros"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {bio ? (
                <>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-medium">{bio.peso_kg ?? "-"} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">IMC</p>
                      <p className="font-medium">{bio.imc ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gordura</p>
                      <p className="font-medium">{bio.gordura_percent ?? "-"}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">TMB</p>
                      <p className="font-medium">{bio.tmb_kcal ?? "-"} kcal</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Idade Corporal</p>
                      <p className="font-medium">{bio.idade_corporal ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gordura Visceral</p>
                      <p className="font-medium">{bio.gordura_visceral ?? "-"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Observações</p>
                      <p className="font-medium">{bio.observacoes || "-"}</p>
                    </div>
                  </div>

                  {grafico && grafico.length > 0 && (
                    <div className="pt-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={grafico}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="nome" stroke="hsl(var(--foreground))" />
                          <YAxis stroke="hsl(var(--foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.5rem",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Nenhuma bioimpedância registrada.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Perimetria */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Perimetria</CardTitle>
            <CardDescription>
              {perimetria ? `Avaliação: ${prettyDate(perimetria.data_avaliacao)}` : "Sem registros"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {perimetria ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  ["Pescoço", perimetria.pescoco_cm],
                  ["Ombro", perimetria.ombro_cm],
                  ["Tórax", perimetria.torax_cm],
                  ["Cintura", perimetria.cintura_cm],
                  ["Abdômen", perimetria.abdomen_cm],
                  ["Quadril", perimetria.quadril_cm],
                  ["Braço D", perimetria.braco_dir_cm],
                  ["Braço E", perimetria.braco_esq_cm],
                  ["Antebraço D", perimetria.antebraco_dir_cm],
                  ["Antebraço E", perimetria.antebraco_esq_cm],
                  ["Coxa D", perimetria.coxa_dir_cm],
                  ["Coxa E", perimetria.coxa_esq_cm],
                  ["Panturrilha D", perimetria.panturrilha_dir_cm],
                  ["Panturrilha E", perimetria.panturrilha_esq_cm],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium">{val != null ? `${val} cm` : "-"}</p>
                  </div>
                ))}
                <div className="md:col-span-2 lg:col-span-4">
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium">{perimetria.observacoes || "-"}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma perimetria registrada.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DetalhePaciente;
