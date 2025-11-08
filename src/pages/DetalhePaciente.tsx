import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DetalhePaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Substituir mock por dados reais do backend GET /api/pacientes/:id
  const paciente = {
    id: Number(id),
    nome: "Maria Silva Santos",
    idade: 35,
    cpf: "123.456.789-00",
    estadoCivil: "Casada",
    dataNascimento: "15/05/1988",
    endereco: "Rua das Flores, 123",
    bairro: "Jardim Paulista",
    cep: "01234-567",
    email: "maria.silva@email.com",
    profissao: "Professora",
    telefone: "(11) 98765-4321",
    perimetria: {
      altura: "165",
      peso: "68.5",
      peitoral: "92",
      bracoDireito: "28",
      bracoEsquerdo: "27.5",
      umbigo: "85",
      abdomenInferior: "88",
      quadril: "98",
      coxaDireita: "55",
      coxaEsquerda: "54.5",
      panturrilha: "36",
      pescoco: "32",
    },
    bioimpedancia: {
      peso: "68.5",
      imc: "25.2",
      gorduraPercent: "28.5",
      musculoPercent: "35.8",
      tmb: "1450",
      idadeMetabolica: "38",
      gorduraVisceral: "7.2",
    },
  };

  // Dados para o gráfico de bioimpedância
  const dadosGrafico = [
    { nome: "Gordura", valor: parseFloat(paciente.bioimpedancia.gorduraPercent), cor: "#E63462" },
    { nome: "Músculo", valor: parseFloat(paciente.bioimpedancia.musculoPercent), cor: "#9D4EDD" },
    { nome: "Outros", valor: 100 - parseFloat(paciente.bioimpedancia.gorduraPercent) - parseFloat(paciente.bioimpedancia.musculoPercent), cor: "#CBD5E1" },
  ];

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
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{paciente.nome}</h1>
            <p className="text-muted-foreground mt-1">
              Informações completas do paciente
            </p>
          </div>
          <Button variant="outline">Editar</Button>
        </div>

        {/* Informações Principais */}
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/10">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade</p>
                  <p className="font-semibold">{paciente.idade} anos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm">{paciente.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-semibold">{paciente.telefone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bairro</p>
                  <p className="font-semibold">{paciente.bairro}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>🧍 Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{paciente.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado Civil</p>
                  <p className="font-medium">{paciente.estadoCivil}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{paciente.dataNascimento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profissão</p>
                  <p className="font-medium">{paciente.profissao}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{paciente.endereco}, {paciente.bairro}</p>
                  <p className="text-sm text-muted-foreground">CEP: {paciente.cep}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bioimpedância */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>⚖️ Bioimpedância</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="font-medium">{paciente.bioimpedancia.peso} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IMC</p>
                  <p className="font-medium">{paciente.bioimpedancia.imc}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gordura</p>
                  <p className="font-medium">{paciente.bioimpedancia.gorduraPercent}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Músculo</p>
                  <p className="font-medium">{paciente.bioimpedancia.musculoPercent}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TMB</p>
                  <p className="font-medium">{paciente.bioimpedancia.tmb} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade Metabólica</p>
                  <p className="font-medium">{paciente.bioimpedancia.idadeMetabolica} anos</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Gordura Visceral</p>
                  <p className="font-medium">{paciente.bioimpedancia.gorduraVisceral}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Composição Corporal */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>📊 Composição Corporal</CardTitle>
            <CardDescription>
              Visualização gráfica da bioimpedância
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="nome" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem"
                  }} 
                />
                <Legend />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Perimetria */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>📏 Perimetria</CardTitle>
            <CardDescription>
              Medidas corporais detalhadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Altura</p>
                <p className="font-medium">{paciente.perimetria.altura} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso</p>
                <p className="font-medium">{paciente.perimetria.peso} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peitoral</p>
                <p className="font-medium">{paciente.perimetria.peitoral} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Braço D</p>
                <p className="font-medium">{paciente.perimetria.bracoDireito} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Braço E</p>
                <p className="font-medium">{paciente.perimetria.bracoEsquerdo} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Umbigo</p>
                <p className="font-medium">{paciente.perimetria.umbigo} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Abdômen Inf.</p>
                <p className="font-medium">{paciente.perimetria.abdomenInferior} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quadril</p>
                <p className="font-medium">{paciente.perimetria.quadril} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coxa D</p>
                <p className="font-medium">{paciente.perimetria.coxaDireita} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coxa E</p>
                <p className="font-medium">{paciente.perimetria.coxaEsquerda} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Panturrilha</p>
                <p className="font-medium">{paciente.perimetria.panturrilha} cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pescoço</p>
                <p className="font-medium">{paciente.perimetria.pescoco} cm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DetalhePaciente;
