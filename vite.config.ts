import path from "path";
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    reactRouter(),
    tailwindcss(),
    viteStaticCopy({
			targets: [
				{
					src: "node_modules/mupdf/dist/mupdf-wasm.wasm",
					dest: "node_modules/.vite/deps",
				},
        {
          src: "node_modules/onnxruntime-web/dist/*.wasm",
          dest: ".",
        },
			]
		}),
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  worker: {
    format: 'es',
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
  },
  optimizeDeps: {
		exclude: ["mupdf"],
  },
});
