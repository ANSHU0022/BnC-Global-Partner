import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        dashboard: 'partner-dashboard.html',
        admin: 'admin-dashboard.html'
      }
    }
  }
})