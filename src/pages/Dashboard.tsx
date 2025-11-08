import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Activity, Calendar } from "lucide-react";

const Dashboard = () => {
  // TODO: Aqui será integrada a API Python (Pandas / análise de dados)
  // Quando o backend Python estiver pronto, substituir estes dados mockados
  // por chamadas reais: fetch(`${API_BASE_URL}/api/analytics`)

  // Dados mockados para evolução de peso médio
  const dadosEvolucaoPeso = [
    { mes: "Jan", peso: 68.2 },
    { mes: "Fev", peso: 67.8 },
    { mes: "Mar", peso: 67.2 },
    { mes: "Abr", peso: 66.8 },
    { mes: "Mai", peso: 66.3 },
    { mes: "Jun", peso: 65.9 },
  ];

  // Dados mockados para distribuição de IMC
  const dadosIMC = [
    { nome: "Baixo Peso", valor: 12, cor: "#60A5FA" },
    { nome: "Normal", valor: 145, cor: "#34D399" },
    { nome: "Sobrepeso", valor: 68, cor: "#FBBF24" },
    { nome: "Obesidade", valor: 22, cor: "#F87171" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Analítico</h1>
          <p className="text-muted-foreground mt-1">
            Análise de dados e estatísticas dos pacientes
          </p>
          <p className="text-sm text-primary mt-2 font-medium">
            🐍 Preparado para integração com API Python + Pandas
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Pacientes
              </CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Peso Médio
              </CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65.9 kg</div>
              <p className="text-xs text-muted-foreground mt-1">
                -2.3 kg vs início do ano
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                IMC Médio
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Faixa saudável
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consultas Mês
              </CardTitle>
              <Calendar className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">
                +8% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolução de Peso Médio */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Evolução do Peso Médio</CardTitle>
              <CardDescription>
                Acompanhamento mensal dos pacientes em 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosEvolucaoPeso}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" domain={[64, 70]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="peso"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    name="Peso (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de IMC */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Distribuição por IMC</CardTitle>
              <CardDescription>
                Classificação dos pacientes por faixa de IMC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosIMC}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, valor }) => `${nome}: ${valor}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dadosIMC.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Aviso de Integração Futura */}
        <Card className="shadow-card bg-accent/20 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔮 Integração Python em Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Este dashboard está preparado para receber dados processados por <strong>Python + Pandas</strong>.
              Quando o backend de análise estiver pronto, os gráficos e estatísticas serão alimentados
              automaticamente pela API <code className="px-2 py-1 bg-muted rounded text-sm">/api/analytics</code>.
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-mono text-muted-foreground">
                // TODO: Integrar com endpoint Python<br />
                // const response = await fetch(`{"{API_BASE_URL}"}/api/analytics`);
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
