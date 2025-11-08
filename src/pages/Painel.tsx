import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, BarChart3, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Painel = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Ver Pacientes",
      description: "Acessar lista completa de pacientes",
      icon: Users,
      action: () => navigate("/pacientes"),
      color: "from-primary to-primary/80",
    },
    {
      title: "Cadastrar Paciente",
      description: "Adicionar novo paciente ao sistema",
      icon: UserPlus,
      action: () => navigate("/pacientes/novo"),
      color: "from-accent to-secondary",
    },
    {
      title: "Dashboard",
      description: "Visualizar análises e estatísticas",
      icon: BarChart3,
      action: () => navigate("/dashboard"),
      color: "from-muted to-muted/80",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Cabeçalho de boas-vindas */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-foreground/20 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Bem-vinda, Dra. Neuzeli!</h1>
              <p className="text-primary-foreground/90 mt-1">
                Sistema de Gestão de Pacientes - {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">247</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12 este mês
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consultas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 pendentes
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avaliações Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">45</div>
              <p className="text-xs text-muted-foreground mt-1">
                +8% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                className="shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer group"
                onClick={action.action}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Painel;
