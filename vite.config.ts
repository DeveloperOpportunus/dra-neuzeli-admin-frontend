import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // ⚙️ Config do servidor (para desenvolvimento)
  server: {
    host: true, // aceita conexões externas
    port: 8080,
  },

  // ⚙️ Config de build (para produção)
  build: {
    outDir: "dist", // saída padrão do Vite
    emptyOutDir: true, // limpa antes do build
  },

  // ⚙️ Define o caminho base para assets no deploy
  base: "/",

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
