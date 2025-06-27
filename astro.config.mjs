import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  adapter: "@astrojs/cloudflare",
});