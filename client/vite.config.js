import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: parseInt(env.VITE_APP_CLIENT_PORT) || 4018,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    define: {
      global: 'globalThis',
    },
  }
})