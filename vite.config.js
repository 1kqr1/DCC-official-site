import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dccaiDevApi } from './server/dccai/vite-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), dccaiDevApi()],
  // プレビュー実行環境が PORT を割り当てた場合はそれに従う（未設定なら従来どおり 5173）
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
