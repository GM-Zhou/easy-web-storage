import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  format: ['esm', 'iife'],
  globalName: 'easyWebStore',
  dts: true,
  minify: true,
});
