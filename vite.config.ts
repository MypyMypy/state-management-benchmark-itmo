import { defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const getConfig = ({ mode }: { mode: string }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    build: { sourcemap: true },
    base: env.VITE_BASE_PATH,
  };
};

export default defineConfig(getConfig);
