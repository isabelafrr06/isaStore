import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3001 (proxy)'

  return {
    plugins: [
      react(),
      {
        name: 'backend-info',
        configureServer(server) {
          server.httpServer?.once('listening', () => {
            console.log(`  \x1b[36m➜\x1b[0m  Backend API: \x1b[1m${apiUrl}\x1b[0m`)
          })
        }
      }
    ],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    }
  }
})

