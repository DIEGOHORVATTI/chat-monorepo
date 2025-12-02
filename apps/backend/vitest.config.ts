import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@contacts': path.resolve(__dirname, './src/modules/contacts'),
      '@identity': path.resolve(__dirname, './src/modules/identity'),
      '@notifications': path.resolve(__dirname, './src/modules/notifications'),
      '@chat': path.resolve(__dirname, './src/modules/chat'),
    },
  },
})
