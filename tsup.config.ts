import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  clean: true,
  treeshake: true,
  sourcemap: true,
  minify: true,
  external: [], // 按需添加外部依赖
});