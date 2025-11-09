import { Navigate, Outlet } from "react-router-dom";
import { getToken, isTokenValid, clearToken } from "@/lib/auth";

export default function ProtectedRoute() {
  const token = getToken();

  // se não existir ou estiver inválido → limpa e redireciona pro login
  if (!isTokenValid(token)) {
    clearToken();
    return <Navigate to="/login" replace />;
  }

  // se estiver tudo certo → renderiza as rotas internas
  return <Outlet />;
}