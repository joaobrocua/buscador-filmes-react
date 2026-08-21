import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Precisa bater com o nome do repositório no GitHub Pages.
  // Se você criar o repo com outro nome, ajuste aqui também.
  base: '/buscador-filmes/',
})
