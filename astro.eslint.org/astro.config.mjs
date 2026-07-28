import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://eslint.org",
  integrations: [react()],

  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "es", "fr", "hi", "ja", "pt-br", "zh-hans"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
