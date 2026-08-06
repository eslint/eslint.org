import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const getTextContent = (node) => {
  if (node.type === "text") {
    return node.value;
  }

  return (node.children ?? []).map(getTextContent).join("");
};

const addCodeLineNumbers = () => (tree) => {
  const visit = (node) => {
    if (node.type !== "element") {
      return;
    }

    const className = node.properties?.className ?? [];
    const code = node.children?.find((child) => child.tagName === "code");

    if (node.tagName === "pre" && className.some((name) => name.startsWith("language-")) && code) {
      const lineCount = getTextContent(code).split("\n").length - 1;

      className.push("line-numbers-mode");
      node.children.push({
        type: "element",
        tagName: "div",
        properties: { className: ["line-numbers-wrapper"], ariaHidden: "true" },
        children: Array.from({ length: lineCount }, (_, index) => ({
          type: "element",
          tagName: "span",
          properties: { className: ["line-number"] },
          children: [{ type: "text", value: String(index + 1) }],
        })).flatMap((line, index) =>
          index === lineCount - 1
            ? [line]
            : [line, { type: "element", tagName: "br", properties: {}, children: [] }],
        ),
      });
    }

    node.children?.forEach(visit);
  };

  tree.children.forEach(visit);
};

// https://astro.build/config
export default defineConfig({
  site: "https://eslint.org",
  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [addCodeLineNumbers],
  },
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
