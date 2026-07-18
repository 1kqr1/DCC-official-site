import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  // プレビュー実行環境が PORT を割り当てた場合はそれに従う（未設定なら従来どおり 5173）
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
