import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  base: '/EVENTOS',
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
