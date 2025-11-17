import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { ENDPOINTS, API_BASE_URL, authHeaders } from "@/config/api";

// --- Helpers iguais aos usados no cadastro ---
const onlyDigits = (v: string) => v?.replace(/\D+/g, "") ?? "";
const normalizePhoneBR = (v: string) => {
  const digits = onlyDigits(v);
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  const noLeading = digits.replace(/^0+/, "");
  return "55" + noLeading;
};
const prune = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ""));

function validate(dp: any) {
  const phoneDigits = normalizePhoneBR(dp.telefone || "");
  const cpfDigits = onlyDigits(dp.cpf || "");

  const errors: string[] = [];
  if (dp.telefone?.trim() && !/^55\d{10,11}$/.test(phoneDigits)) {
    errors.push("Telefone deve começar com 55 + DDD + número (ex.: 5521999999999).");
  }

  if (dp.cpf?.trim() && !/^\d{11}$/.test(cpfDigits)) {
    errors.push("CPF deve ter 11 dígitos.");
  }

  return { errors, phoneDigits, cpfDigits };
}

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
  observacoes?: string | null;
  altura_cm?: number | null;
  peso_kg?: number | null;
};

export default function EditPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    planoSaude: "",
    numeroCarteira: "",
    observacoes: "",
    altura_cm: "",
    peso_kg: "",
  });

  useEffect(() => {
    let abort = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(ENDPOINTS.pacienteById(String(id)), { headers: { ...authHeaders() } });
        const data: Paciente = await res.json();
        if (!res.ok) throw new Error((data as any)?.error || "Falha ao carregar paciente");

        if (abort) return;
        setForm({
          nome: data.nome || "",
          email: data.email || "",
          telefone: data.telefone || "",
          cpf: data.cpf || "",
          dataNascimento: data.data_nascimento || "",
          sexo: data.sexo || "",
          logradouro: data.logradouro || "",
          numero: data.numero || "",
          complemento: data.complemento || "",
          bairro: data.bairro || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          cep: data.cep || "",
          planoSaude: data.plano_saude || "",
          numeroCarteira: data.numero_carteira || "",
          observacoes: data.observacoes || "",
          altura_cm: data.altura_cm != null ? String(data.altura_cm) : "",
          peso_kg: data.peso_kg != null ? String(data.peso_kg) : "",
        });
      } catch (e: any) {
        toast({ title: "Erro", description: e?.message ?? "Falha ao carregar paciente", variant: "destructive" });
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    const { errors, phoneDigits, cpfDigits } = validate(form);
    if (errors.length) {
      toast({ title: "Verifique os campos", description: errors.join(" "), variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        dadosPessoais: prune({
          nome: form.nome.trim(),
          email: form.email.trim().toLowerCase(),
          telefone: phoneDigits,                // "55..." sem traços/espaços
          cpf: cpfDigits,                       // 11 dígitos
          dataNascimento: form.dataNascimento || undefined,
          sexo: form.sexo || undefined,
          logradouro: form.logradouro || undefined,
          numero: form.numero || undefined,
          complemento: form.complemento || undefined,
          bairro: form.bairro || undefined,
          cidade: form.cidade || undefined,
          estado: form.estado || undefined,
          cep: onlyDigits(form.cep || ""),
          planoSaude: form.planoSaude || undefined,
          numeroCarteira: form.numeroCarteira || undefined,
          observacoes: form.observacoes || undefined,
          altura_cm: form.altura_cm !== "" ? Number(String(form.altura_cm).replace(",", ".")) : undefined,
          peso_kg: form.peso_kg !== "" ? Number(String(form.peso_kg).replace(",", ".")) : undefined,
        }),
      };

      const res = await fetch(`${API_BASE_URL}/api/pacientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Falha ao salvar");

      toast({ title: "Salvo com sucesso", description: `${form.nome} atualizado.` });
      navigate(`/pacientes/${id}`);
    } catch (e: any) {
      toast({ title: "Erro ao salvar", description: e?.message ?? "Tente novamente.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">Carregando...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(`/pacientes/${id}`)} type="button">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Paciente</h1>
            <p className="text-muted-foreground mt-1">Atualize as informações do paciente</p>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone (55+DDD+número) *</Label>
                  <Input id="telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input id="cpf" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Nascimento</Label>
                  <Input id="dataNascimento" type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Input id="sexo" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input id="logradouro" value={form.logradouro} onChange={(e) => setForm({ ...form, logradouro: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input id="complemento" value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado (UF)</Label>
                  <Input id="estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planoSaude">Plano de Saúde</Label>
                  <Input id="planoSaude" value={form.planoSaude} onChange={(e) => setForm({ ...form, planoSaude: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroCarteira">Nº da Carteira</Label>
                  <Input id="numeroCarteira" value={form.numeroCarteira} onChange={(e) => setForm({ ...form, numeroCarteira: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="altura_cm">Altura (cm)</Label>
                  <Input id="altura_cm" type="number" inputMode="decimal" step="0.01" value={form.altura_cm}
                         onChange={(e) => setForm({ ...form, altura_cm: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso_kg">Peso (kg)</Label>
                  <Input id="peso_kg" type="number" inputMode="decimal" step="0.1" value={form.peso_kg}
                         onChange={(e) => setForm({ ...form, peso_kg: e.target.value })} />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input id="observacoes" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(`/pacientes/${id}`)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
