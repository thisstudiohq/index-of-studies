import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { devtools } from "@tanstack/devtools-vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	environments: {
		ssr: {
			resolve: {
				noExternal: ["gsap", "lenis", "ogl", "three"],
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {},
		},
	},
	plugins: [devtools(), netlify(), tailwindcss(), tanstackStart(), viteReact()],
});

export default config;
