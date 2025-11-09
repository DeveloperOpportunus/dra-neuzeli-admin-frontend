// src/pages/pacientes/NovoPaciente.tsx
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { ENDPOINTS, authHeaders } from "@/config/api";

// --- Helpers ---
const toNumberOrNull = (v: string) => {
  if (v == null) return null;
  const trimmed = String(v).trim().replace(",", ".");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};

const onlyDigits = (v: string) => v.replace(/\D+/g, "");

const normalizePhoneBR = (v: string) => {
  const digits = onlyDigits(v);
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  // remove zeros iniciais e prefixa 55
  const noLeading = digits.replace(/^0+/, "");
  return "55" + noLeading;
};

function prune(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
}

function validateForm(dp: any) {
  const errors: string[] = [];
  if (!dp.nome?.trim()) errors.push("Nome é obrigatório.");
  if (!dp.email?.trim()) errors.push("Email é obrigatório.");

  const phoneDigits = normalizePhoneBR(dp.telefone);
  if (!dp.telefone?.trim()) {
    errors.push("Telefone é obrigatório.");
  } else if (!/^55\d{10,11}$/.test(phoneDigits)) {
    errors.push("Telefone deve começar com 55 + DDD + número (ex.: 5521999999999).");
  }

  const cpfDigits = onlyDigits(dp.cpf);
  if (!dp.cpf?.trim()) {
    errors.push("CPF é obrigatório.");
  } else if (!/^\d{11}$/.test(cpfDigits)) {
    errors.push("CPF deve ter 11 dígitos.");
  }

  return errors;
}

const NovoPaciente = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- DADOS PESSOAIS (agora com todos os campos do schema de 'pacientes') ---
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",    // YYYY-MM-DD
    sexo: "",              // "F"/"M"/...
    cpf: "",
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
    // métricas no cadastro principal (derivadas do form de perimetria/bio):
    // altura_cm e peso_kg serão calculados no submit
  });

  // --- PERIMETRIA (todos os campos) ---
  const [perimetria, setPerimetria] = useState({
    dataAvaliacao: "",       // YYYY-MM-DD (opcional; se vazio, backend usa agora)
    pescoco: "",
    ombro: "",
    torax: "",
    cintura: "",
    abdomen: "",
    quadril: "",
    bracoDireito: "",
    bracoEsquerdo: "",
    antebracoDireito: "",
    antebracoEsquerdo: "",
    coxaDireita: "",
    coxaEsquerda: "",
    panturrilhaDireita: "",
    panturrilhaEsquerda: "",
    observacoes: "",
    // campos do form anterior (mantidos para UX e mapeados):
    altura: "",   // cm -> pacientes.altura_cm
    peso: "",     // kg (fallback para pacientes.peso_kg)
    // peitoral/umbigo/abdomenInferior/quadril/panturrilha/pescoco continuam mapeando
    peitoral: "",
    umbigo: "",
    abdomenInferior: "",
    panturrilha: "",
  });

  // --- BIOIMPEDÂNCIA (todos os campos) ---
  const [bioimpedancia, setBioimpedancia] = useState({
    dataAvaliacao: "",  // YYYY-MM-DD
    peso: "",
    imc: "",
    gorduraPercent: "",
    massaMagra: "",
    massaMuscularEsqueletica: "",
    aguaPercent: "",
    tmb: "",
    idadeMetabolica: "",
    gorduraVisceral: "",
    anguloFase: "",
    observacoes: "",
    // campo do form anterior:
    musculoPercent: "", // não tem coluna específica; manteremos para futura UX (não será enviado)
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // validação mínima
      const errors = validateForm(dadosPessoais);
      if (errors.length) {
        toast({
          title: "Verifique os campos",
          description: errors.join(" "),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // normalizações principais
      const phoneNorm = normalizePhoneBR(dadosPessoais.telefone); // "5521..."
      if (!phoneNorm.startsWith("55")) {
        toast({
          title: "Telefone inválido",
          description: "Informe DDD + número. Ex.: (21) 99999-87326",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const altura_cm = toNumberOrNull(perimetria.altura);
      const peso_kg_from_bio = toNumberOrNull(bioimpedancia.peso);
      const peso_kg_from_per = toNumberOrNull(perimetria.peso);
      const peso_kg = peso_kg_from_bio ?? peso_kg_from_per ?? null;

      // Mapeamento final para o backend (3 tabelas)
      const payload = {
        dadosPessoais: prune({
          nome: dadosPessoais.nome.trim(),
          email: dadosPessoais.email.trim().toLowerCase(),
          telefone: phoneNorm,
          dataNascimento: dadosPessoais.dataNascimento || undefined,
          sexo: dadosPessoais.sexo || undefined,
          cpf: dadosPessoais.cpf ? onlyDigits(dadosPessoais.cpf) : undefined,
          logradouro: dadosPessoais.logradouro || undefined,
          numero: dadosPessoais.numero || undefined,
          complemento: dadosPessoais.complemento || undefined,
          bairro: dadosPessoais.bairro || undefined,
          cidade: dadosPessoais.cidade || undefined,
          estado: dadosPessoais.estado || undefined,
          cep: dadosPessoais.cep ? onlyDigits(dadosPessoais.cep) : undefined,
          planoSaude: dadosPessoais.planoSaude || undefined,
          numeroCarteira: dadosPessoais.numeroCarteira || undefined,
          observacoes: dadosPessoais.observacoes || undefined,
          // métricas básicas no cadastro principal:
          altura_cm,
          peso_kg,
        }),

        perimetria: prune({
          dataAvaliacao: perimetria.dataAvaliacao || undefined,
          pescoco: toNumberOrNull(perimetria.pescoco),
          ombro: toNumberOrNull(perimetria.ombro),
          torax: toNumberOrNull(perimetria.torax) ?? toNumberOrNull(perimetria.peitoral),
          cintura: toNumberOrNull(perimetria.cintura) ?? toNumberOrNull(perimetria.umbigo),
          abdomen: toNumberOrNull(perimetria.abdomen) ?? toNumberOrNull(perimetria.abdomenInferior),
          quadril: toNumberOrNull(perimetria.quadril),
          bracoDireito: toNumberOrNull(perimetria.bracoDireito),
          bracoEsquerdo: toNumberOrNull(perimetria.bracoEsquerdo),
          antebracoDireito: toNumberOrNull(perimetria.antebracoDireito),
          antebracoEsquerdo: toNumberOrNull(perimetria.antebracoEsquerdo),
          coxaDireita: toNumberOrNull(perimetria.coxaDireita),
          coxaEsquerda: toNumberOrNull(perimetria.coxaEsquerda),
          panturrilhaDireita:
            toNumberOrNull(perimetria.panturrilhaDireita) ?? toNumberOrNull(perimetria.panturrilha),
          panturrilhaEsquerda: toNumberOrNull(perimetria.panturrilhaEsquerda),
          observacoes: perimetria.observacoes || undefined,
        }),

        bioimpedancia: prune({
          dataAvaliacao: bioimpedancia.dataAvaliacao || undefined,
          peso: peso_kg_from_bio, // kg
          imc: toNumberOrNull(bioimpedancia.imc),
          gorduraPercent: toNumberOrNull(bioimpedancia.gorduraPercent),
          massaMagra: toNumberOrNull(bioimpedancia.massaMagra),
          massaMuscularEsqueletica: toNumberOrNull(bioimpedancia.massaMuscularEsqueletica),
          aguaPercent: toNumberOrNull(bioimpedancia.aguaPercent),
          tmb: toNumberOrNull(bioimpedancia.tmb),
          idadeMetabolica: toNumberOrNull(bioimpedancia.idadeMetabolica),
          gorduraVisceral: toNumberOrNull(bioimpedancia.gorduraVisceral),
          anguloFase: toNumberOrNull(bioimpedancia.anguloFase),
          observacoes: bioimpedancia.observacoes || undefined,
          // musculoPercent (do form antigo) não tem coluna -> ignorado
        }),
      };

      const res = await fetch(ENDPOINTS.novoPaciente, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Falha ao salvar paciente");
      }

      toast({
        title: "Paciente cadastrado com sucesso!",
        description: `${dadosPessoais.nome} foi adicionado ao sistema.`,
      });

      if (data?.id || data?._id) {
        navigate(`/pacientes/${data.id ?? data._id}`);
      } else {
        navigate("/pacientes");
      }
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err?.message ?? "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/pacientes")}
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Novo Paciente</h1>
            <p className="text-muted-foreground mt-1">
              Preencha os dados para cadastrar um novo paciente
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* DADOS PESSOAIS */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Informações do paciente</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input id="nome" value={dadosPessoais.nome}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, nome: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" inputMode="email" autoComplete="email"
                    value={dadosPessoais.email}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone (DDD+Número) *</Label>
                  <Input id="telefone" inputMode="tel" autoComplete="tel"
                    placeholder="(21) 99999-8726"
                    value={dadosPessoais.telefone}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, telefone: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input id="dataNascimento" type="date"
                    value={dadosPessoais.dataNascimento}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, dataNascimento: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Input id="sexo" placeholder="F/M"
                    value={dadosPessoais.sexo}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, sexo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" inputMode="numeric" placeholder="000.000.000-00"
                    value={dadosPessoais.cpf}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cpf: e.target.value })}
                    required
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input id="logradouro" value={dadosPessoais.logradouro}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, logradouro: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input id="numero" value={dadosPessoais.numero}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, numero: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input id="complemento" value={dadosPessoais.complemento}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, complemento: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input id="bairro" value={dadosPessoais.bairro}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, bairro: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" value={dadosPessoais.cidade}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cidade: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado (UF)</Label>
                  <Input id="estado" placeholder="RJ, SP..."
                    value={dadosPessoais.estado}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, estado: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" inputMode="numeric" placeholder="00000-000"
                    value={dadosPessoais.cep}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cep: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planoSaude">Plano de Saúde</Label>
                  <Input id="planoSaude" value={dadosPessoais.planoSaude}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, planoSaude: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroCarteira">Nº da Carteira</Label>
                  <Input id="numeroCarteira" value={dadosPessoais.numeroCarteira}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, numeroCarteira: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input id="observacoes" value={dadosPessoais.observacoes}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, observacoes: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* PERIMETRIA */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Perimetria</CardTitle>
                <CardDescription>Medidas corporais</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataAvaliacaoPer">Data da Avaliação</Label>
                  <Input id="dataAvaliacaoPer" type="date"
                    value={perimetria.dataAvaliacao}
                    onChange={(e) => setPerimetria({ ...perimetria, dataAvaliacao: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input id="altura" type="number" inputMode="decimal" step="0.01"
                    value={perimetria.altura}
                    onChange={(e) => setPerimetria({ ...perimetria, altura: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pesoPer">Peso (kg)</Label>
                  <Input id="pesoPer" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.peso}
                    onChange={(e) => setPerimetria({ ...perimetria, peso: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pescoco">Pescoço (cm)</Label>
                  <Input id="pescoco" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.pescoco}
                    onChange={(e) => setPerimetria({ ...perimetria, pescoco: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ombro">Ombro (cm)</Label>
                  <Input id="ombro" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.ombro}
                    onChange={(e) => setPerimetria({ ...perimetria, ombro: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="torax">Tórax (cm)</Label>
                  <Input id="torax" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.torax}
                    onChange={(e) => setPerimetria({ ...perimetria, torax: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cintura">Cintura (cm)</Label>
                  <Input id="cintura" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.cintura}
                    onChange={(e) => setPerimetria({ ...perimetria, cintura: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abdomen">Abdômen (cm)</Label>
                  <Input id="abdomen" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.abdomen}
                    onChange={(e) => setPerimetria({ ...perimetria, abdomen: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quadril">Quadril (cm)</Label>
                  <Input id="quadril" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.quadril}
                    onChange={(e) => setPerimetria({ ...perimetria, quadril: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bracoDireito">Braço Direito (cm)</Label>
                  <Input id="bracoDireito" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.bracoDireito}
                    onChange={(e) => setPerimetria({ ...perimetria, bracoDireito: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bracoEsquerdo">Braço Esquerdo (cm)</Label>
                  <Input id="bracoEsquerdo" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.bracoEsquerdo}
                    onChange={(e) => setPerimetria({ ...perimetria, bracoEsquerdo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="antebracoDireito">Antebraço Direito (cm)</Label>
                  <Input id="antebracoDireito" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.antebracoDireito}
                    onChange={(e) => setPerimetria({ ...perimetria, antebracoDireito: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="antebracoEsquerdo">Antebraço Esquerdo (cm)</Label>
                  <Input id="antebracoEsquerdo" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.antebracoEsquerdo}
                    onChange={(e) => setPerimetria({ ...perimetria, antebracoEsquerdo: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coxaDireita">Coxa Direita (cm)</Label>
                  <Input id="coxaDireita" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.coxaDireita}
                    onChange={(e) => setPerimetria({ ...perimetria, coxaDireita: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coxaEsquerda">Coxa Esquerda (cm)</Label>
                  <Input id="coxaEsquerda" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.coxaEsquerda}
                    onChange={(e) => setPerimetria({ ...perimetria, coxaEsquerda: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panturrilhaDireita">Panturrilha Direita (cm)</Label>
                  <Input id="panturrilhaDireita" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.panturrilhaDireita}
                    onChange={(e) => setPerimetria({ ...perimetria, panturrilhaDireita: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panturrilhaEsquerda">Panturrilha Esquerda (cm)</Label>
                  <Input id="panturrilhaEsquerda" type="number" inputMode="decimal" step="0.1"
                    value={perimetria.panturrilhaEsquerda}
                    onChange={(e) => setPerimetria({ ...perimetria, panturrilhaEsquerda: e.target.value })} />
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-4">
                  <Label htmlFor="obsPer">Observações</Label>
                  <Input id="obsPer" value={perimetria.observacoes}
                    onChange={(e) => setPerimetria({ ...perimetria, observacoes: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* BIOIMPEDÂNCIA */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Bioimpedância</CardTitle>
                <CardDescription>Análise de composição corporal</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataAvaliacaoBio">Data da Avaliação</Label>
                  <Input id="dataAvaliacaoBio" type="date"
                    value={bioimpedancia.dataAvaliacao}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, dataAvaliacao: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesoBio">Peso (kg)</Label>
                  <Input id="pesoBio" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.peso}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, peso: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imc">IMC</Label>
                  <Input id="imc" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.imc}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, imc: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gorduraPercent">Gordura (%)</Label>
                  <Input id="gorduraPercent" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.gorduraPercent}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, gorduraPercent: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="massaMagra">Massa Magra (kg)</Label>
                  <Input id="massaMagra" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.massaMagra}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, massaMagra: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="massaMuscular">Massa Muscular Esquelética (kg)</Label>
                  <Input id="massaMuscular" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.massaMuscularEsqueletica}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, massaMuscularEsqueletica: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aguaPercent">Água (%)</Label>
                  <Input id="aguaPercent" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.aguaPercent}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, aguaPercent: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tmb">TMB (kcal)</Label>
                  <Input id="tmb" type="number" inputMode="numeric"
                    value={bioimpedancia.tmb}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, tmb: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idadeMetabolica">Idade Corporal</Label>
                  <Input id="idadeMetabolica" type="number" inputMode="numeric"
                    value={bioimpedancia.idadeMetabolica}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, idadeMetabolica: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gorduraVisceral">Gordura Visceral</Label>
                  <Input id="gorduraVisceral" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.gorduraVisceral}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, gorduraVisceral: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anguloFase">Ângulo de Fase</Label>
                  <Input id="anguloFase" type="number" inputMode="decimal" step="0.1"
                    value={bioimpedancia.anguloFase}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, anguloFase: e.target.value })} />
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-4">
                  <Label htmlFor="obsBio">Observações</Label>
                  <Input id="obsBio" value={bioimpedancia.observacoes}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, observacoes: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* AÇÕES */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/pacientes")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                {loading ? "Salvando..." : "Salvar Paciente"}
              </Button>
            </div> 
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default NovoPaciente;
