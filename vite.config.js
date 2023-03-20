import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to 'LSA_APPS_' to load all LSA web app env.
  const env = loadEnv(mode, process.cwd(), 'LSA_APPS_');
  console.log(env)
  return {
    envPrefix: 'LSA_APPS_',
    plugins: [react()],
    base: env.LSA_APPS_ADMIN_BASE,
    server: {
      port: env.LSA_APPS_ADMIN_PORT || 3000
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
});
