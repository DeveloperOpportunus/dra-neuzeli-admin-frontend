import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

const NovoPaciente = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: "",
    idade: "",
    cpf: "",
    estadoCivil: "",
    dataNascimento: "",
    endereco: "",
    bairro: "",
    cep: "",
    email: "",
    profissao: "",
    telefone: "",
  });

  const [perimetria, setPerimetria] = useState({
    altura: "",
    peso: "",
    peitoral: "",
    bracoDireito: "",
    bracoEsquerdo: "",
    umbigo: "",
    abdomenInferior: "",
    quadril: "",
    coxaDireita: "",
    coxaEsquerda: "",
    panturrilha: "",
    pescoco: "",
  });

  const [bioimpedancia, setBioimpedancia] = useState({
    peso: "",
    imc: "",
    gorduraPercent: "",
    musculoPercent: "",
    tmb: "",
    idadeMetabolica: "",
    gorduraVisceral: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Integrar com endpoint real do backend (Node + Express)
    // const response = await fetch(`${API_BASE_URL}/api/pacientes`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ dadosPessoais, perimetria, bioimpedancia })
    // });

    // Simulação de salvamento (remover quando integrar backend real)
    setTimeout(() => {
      toast({
        title: "Paciente cadastrado com sucesso!",
        description: `${dadosPessoais.nome} foi adicionado ao sistema.`,
      });
      setLoading(false);
      navigate("/pacientes");
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/pacientes")}
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
            {/* Dados Pessoais */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧍 Dados Pessoais
                </CardTitle>
                <CardDescription>
                  Informações básicas do paciente
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={dadosPessoais.nome}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade *</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={dadosPessoais.idade}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, idade: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={dadosPessoais.cpf}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoCivil">Estado Civil</Label>
                  <Input
                    id="estadoCivil"
                    value={dadosPessoais.estadoCivil}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, estadoCivil: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={dadosPessoais.dataNascimento}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, dataNascimento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={dadosPessoais.email}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={dadosPessoais.telefone}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={dadosPessoais.profissao}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, profissao: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={dadosPessoais.endereco}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, endereco: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={dadosPessoais.bairro}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, bairro: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={dadosPessoais.cep}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cep: e.target.value })}
                    placeholder="00000-000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Perimetria */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📏 Perimetria
                </CardTitle>
                <CardDescription>
                  Medidas corporais do paciente
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    step="0.01"
                    value={perimetria.altura}
                    onChange={(e) => setPerimetria({ ...perimetria, altura: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pesoPerimetria">Peso (kg)</Label>
                  <Input
                    id="pesoPerimetria"
                    type="number"
                    step="0.1"
                    value={perimetria.peso}
                    onChange={(e) => setPerimetria({ ...perimetria, peso: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peitoral">Peitoral (cm)</Label>
                  <Input
                    id="peitoral"
                    type="number"
                    step="0.1"
                    value={perimetria.peitoral}
                    onChange={(e) => setPerimetria({ ...perimetria, peitoral: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bracoDireito">Braço Direito (cm)</Label>
                  <Input
                    id="bracoDireito"
                    type="number"
                    step="0.1"
                    value={perimetria.bracoDireito}
                    onChange={(e) => setPerimetria({ ...perimetria, bracoDireito: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bracoEsquerdo">Braço Esquerdo (cm)</Label>
                  <Input
                    id="bracoEsquerdo"
                    type="number"
                    step="0.1"
                    value={perimetria.bracoEsquerdo}
                    onChange={(e) => setPerimetria({ ...perimetria, bracoEsquerdo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umbigo">Umbigo (cm)</Label>
                  <Input
                    id="umbigo"
                    type="number"
                    step="0.1"
                    value={perimetria.umbigo}
                    onChange={(e) => setPerimetria({ ...perimetria, umbigo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abdomenInferior">Abdômen Inferior (cm)</Label>
                  <Input
                    id="abdomenInferior"
                    type="number"
                    step="0.1"
                    value={perimetria.abdomenInferior}
                    onChange={(e) => setPerimetria({ ...perimetria, abdomenInferior: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quadril">Quadril (cm)</Label>
                  <Input
                    id="quadril"
                    type="number"
                    step="0.1"
                    value={perimetria.quadril}
                    onChange={(e) => setPerimetria({ ...perimetria, quadril: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coxaDireita">Coxa Direita (cm)</Label>
                  <Input
                    id="coxaDireita"
                    type="number"
                    step="0.1"
                    value={perimetria.coxaDireita}
                    onChange={(e) => setPerimetria({ ...perimetria, coxaDireita: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coxaEsquerda">Coxa Esquerda (cm)</Label>
                  <Input
                    id="coxaEsquerda"
                    type="number"
                    step="0.1"
                    value={perimetria.coxaEsquerda}
                    onChange={(e) => setPerimetria({ ...perimetria, coxaEsquerda: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panturrilha">Panturrilha (cm)</Label>
                  <Input
                    id="panturrilha"
                    type="number"
                    step="0.1"
                    value={perimetria.panturrilha}
                    onChange={(e) => setPerimetria({ ...perimetria, panturrilha: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pescoco">Pescoço (cm)</Label>
                  <Input
                    id="pescoco"
                    type="number"
                    step="0.1"
                    value={perimetria.pescoco}
                    onChange={(e) => setPerimetria({ ...perimetria, pescoco: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bioimpedância */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚖️ Bioimpedância
                </CardTitle>
                <CardDescription>
                  Análise de composição corporal
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pesoBio">Peso (kg)</Label>
                  <Input
                    id="pesoBio"
                    type="number"
                    step="0.1"
                    value={bioimpedancia.peso}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, peso: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imc">IMC</Label>
                  <Input
                    id="imc"
                    type="number"
                    step="0.1"
                    value={bioimpedancia.imc}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, imc: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gorduraPercent">Gordura (%)</Label>
                  <Input
                    id="gorduraPercent"
                    type="number"
                    step="0.1"
                    value={bioimpedancia.gorduraPercent}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, gorduraPercent: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="musculoPercent">Músculo (%)</Label>
                  <Input
                    id="musculoPercent"
                    type="number"
                    step="0.1"
                    value={bioimpedancia.musculoPercent}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, musculoPercent: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tmb">TMB (kcal)</Label>
                  <Input
                    id="tmb"
                    type="number"
                    value={bioimpedancia.tmb}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, tmb: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idadeMetabolica">Idade Metabólica</Label>
                  <Input
                    id="idadeMetabolica"
                    type="number"
                    value={bioimpedancia.idadeMetabolica}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, idadeMetabolica: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gorduraVisceral">Gordura Visceral</Label>
                  <Input
                    id="gorduraVisceral"
                    type="number"
                    step="0.1"
                    value={bioimpedancia.gorduraVisceral}
                    onChange={(e) => setBioimpedancia({ ...bioimpedancia, gorduraVisceral: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botão de Salvar */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/pacientes")}
              >
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
