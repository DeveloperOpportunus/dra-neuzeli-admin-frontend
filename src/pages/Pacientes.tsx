import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ENDPOINTS } from "@/config/api";
import { apiFetch } from "@/services/apiFetch";

type Paciente = {
  id: number | string;
  nome: string;
  idade?: number;
  email?: string;
  telefone?: string;
};

const Pacientes = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch<Paciente[]>(ENDPOINTS.pacientes);
        if (mounted) setPacientes(
          (data ?? []).map((p: any) => ({ ...p, id: p.id ?? p._id }))
        );
      } catch (e: any) {
        if (mounted) setErro(e.message || "Falha ao carregar pacientes");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const pacientesFiltrados = useMemo(() => {
    const q = busca.toLowerCase();
    return pacientes.filter((p) =>
      (p.nome?.toLowerCase() ?? "").includes(q) ||
      (p.email?.toLowerCase() ?? "").includes(q)
    );
  }, [busca, pacientes]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pacientes</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os pacientes cadastrados</p>
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
              {loading ? "Carregando..." : `${pacientesFiltrados.length} paciente(s) encontrado(s)`}
              {erro && <span className="text-red-600 ml-2">• {erro}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                  autoComplete="off"
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
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-4"><div className="h-4 w-40 animate-pulse bg-muted rounded" /></td>
                        <td className="p-4"><div className="h-4 w-12 animate-pulse bg-muted rounded" /></td>
                        <td className="p-4"><div className="h-4 w-56 animate-pulse bg-muted rounded" /></td>
                        <td className="p-4"><div className="h-4 w-32 animate-pulse bg-muted rounded" /></td>
                        <td className="p-4"><div className="h-8 w-24 animate-pulse bg-muted rounded" /></td>
                      </tr>
                    ))
                  ) : (
                    pacientesFiltrados.map((paciente, index) => (
                      <tr
                        key={paciente.id}
                        className={`border-t hover:bg-accent/50 cursor-pointer transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        }`}
                        onClick={() => navigate(`/pacientes/${paciente.id}`)}
                      >
                        <td className="p-4 font-medium">{paciente.nome}</td>
                        <td className="p-4 text-muted-foreground">
                          {paciente.idade != null ? `${paciente.idade} anos` : "—"}
                        </td>
                        <td className="p-4 text-muted-foreground">{paciente.email || "—"}</td>
                        <td className="p-4 text-muted-foreground">{paciente.telefone || "—"}</td>
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
                    ))
                  )}
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
