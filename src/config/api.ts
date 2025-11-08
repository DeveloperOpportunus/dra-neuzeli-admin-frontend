// Configuração da API base
export const API_BASE_URL = "https://neuzeli.opportunusai.com";

// TODO: Inserir endpoints e credenciais reais futuramente
// Quando o backend Node.js/Express estiver pronto, descomentar e usar:
/*
export const ENDPOINTS = {
  login: `${API_BASE_URL}/api/login`,
  pacientes: `${API_BASE_URL}/api/pacientes`,
  analytics: `${API_BASE_URL}/api/analytics`,
};
*/

// Mock de endpoints para desenvolvimento
export const ENDPOINTS = {
  login: '/api/login', // TODO: conectar com backend real
  pacientes: '/api/pacientes', // TODO: conectar com backend real
  analytics: '/api/analytics', // TODO: conectar com API Python (Pandas)
};
