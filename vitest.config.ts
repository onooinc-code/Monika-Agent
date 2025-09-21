
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    define: {
      'process.env.NODE_ENV': JSON.stringify('test'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  }
})
