import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://eslint.org",
  integrations: [
    react(),
    sitemap({
      changefreq: "monthly",
      customSitemaps: ["https://eslint.org/docs/latest/sitemap.xml"],
      i18n: {
        defaultLocale: "en",
        locales: {
          de: "de-DE",
          en: "en-US",
          es: "es-ES",
          fr: "fr-FR",
          hi: "hi-IN",
          ja: "ja-JP",
          "pt-br": "pt-BR",
          "zh-hans": "zh-Hans",
        },
      },
    }),
  ],
  vite: {
    resolve: {
      dedupe: ["eslint"],
      mainFields: ["browser", "main", "module"],
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "es", "fr", "hi", "ja", "pt-br", "zh-hans"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
