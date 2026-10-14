import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/redoc/3.x/',
  plugins: [react()],
});
