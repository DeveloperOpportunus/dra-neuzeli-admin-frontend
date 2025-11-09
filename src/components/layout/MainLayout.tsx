// src/components/layout/MainLayout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { logout, getUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const user = getUser<{ nome?: string }>();

  function handleLogout() {
    logout();                  // limpa auth_token + auth_user (do nosso auth.ts)
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-secondary/10 to-accent/20">
      <Sidebar />

      <main className="flex-1 p-0">
        {/* Header/topbar */}
        <div className="sticky top-0 z-10 h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="h-full px-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {user?.nome ? `Olá, ${user.nome}` : "Painel"}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
