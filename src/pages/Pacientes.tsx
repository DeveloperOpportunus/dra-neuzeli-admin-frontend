import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// TODO: Substituir por dados reais do backend GET /api/pacientes
const pacientesMock = [
  { id: 1, nome: "Maria Silva Santos", idade: 35, email: "maria.silva@email.com", telefone: "(11) 98765-4321" },
  { id: 2, nome: "João Pedro Oliveira", idade: 42, email: "joao.pedro@email.com", telefone: "(11) 97654-3210" },
  { id: 3, nome: "Ana Carolina Souza", idade: 28, email: "ana.carolina@email.com", telefone: "(11) 96543-2109" },
  { id: 4, nome: "Carlos Eduardo Lima", idade: 51, email: "carlos.lima@email.com", telefone: "(11) 95432-1098" },
  { id: 5, nome: "Juliana Ferreira Costa", idade: 33, email: "juliana.costa@email.com", telefone: "(11) 94321-0987" },
];

const Pacientes = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  // Filtro simples de busca
  const pacientesFiltrados = pacientesMock.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pacientes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os pacientes cadastrados
            </p>
          </div>
          <Button onClick={() => navigate("/pacientes/novo")} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Novo Paciente
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
            <CardDescription>
              {pacientesFiltrados.length} paciente(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Nome</th>
                    <th className="text-left p-4 font-semibold">Idade</th>
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Telefone</th>
                    <th className="text-left p-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map((paciente, index) => (
                    <tr
                      key={paciente.id}
                      className={`border-t hover:bg-accent/50 cursor-pointer transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                      onClick={() => navigate(`/pacientes/${paciente.id}`)}
                    >
                      <td className="p-4 font-medium">{paciente.nome}</td>
                      <td className="p-4 text-muted-foreground">{paciente.idade} anos</td>
                      <td className="p-4 text-muted-foreground">{paciente.email}</td>
                      <td className="p-4 text-muted-foreground">{paciente.telefone}</td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pacientes/${paciente.id}`);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Pacientes;
