import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  minify: true,
  external: [], // 按需添加外部依赖
});