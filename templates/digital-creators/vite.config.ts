import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.ATHENA_PREVIEW_BASE ?? (process.env.GITHUB_PAGES === 'true' ? '/digital-creators/' : '/'),
  build: { target: 'es2022' },
})
