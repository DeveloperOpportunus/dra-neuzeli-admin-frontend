// Configuração da API base
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Endpoints reais do backend
export const ENDPOINTS = {
  login: `${API_BASE_URL}/api/auth/login`,
  pacientes: `${API_BASE_URL}/api/pacientes`,
  novoPaciente: `${API_BASE_URL}/api/pacientes/novo`,
  pacienteById: (id: string) => `${API_BASE_URL}/api/pacientes/${id}`,
  analytics: `${API_BASE_URL}/api/analytics`,
}

// Helper para anexar token (quando houver)
export function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Mock de endpoints para desenvolvimento
// export const ENDPOINTS = {
//   login: '/api/login', // TODO: conectar com backend real
//   pacientes: '/api/pacientes', // TODO: conectar com backend real
//   analytics: '/api/analytics', // TODO: conectar com API Python (Pandas)
// };
