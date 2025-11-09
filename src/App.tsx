import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
 

import ProtectedRoute from "@/routes/ProtectedRoute"; // <- novo

import Login from "./pages/Login";
import Painel from "./pages/Painel";
import Pacientes from "./pages/Pacientes";
import NovoPaciente from "./pages/NovoPaciente";
import DetalheAluno from "./pages/DetalhePaciente";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import EditPaciente from "./pages/EditPaciente";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redireciona raiz para login (como já estava) */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Privadas (protege tudo abaixo) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/painel" element={<Painel />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/novo" element={<NovoPaciente />} />
            <Route path="/pacientes/:id" element={<DetalheAluno />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pacientes/:id/editar" element={<EditPaciente />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
