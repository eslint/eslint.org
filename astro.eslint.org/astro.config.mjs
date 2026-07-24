// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://eslint.org",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "es", "fr", "hi", "ja", "pt-br", "zh-hans"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
