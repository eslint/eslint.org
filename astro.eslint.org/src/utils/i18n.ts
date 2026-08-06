import { i18n } from "astro:config/client";
import { pathHasLocale } from "astro:i18n";

export const DEFAULT_LANGUAGE = i18n!.defaultLocale;

export async function getSiteStaticPaths() {
  return i18n!.locales.map((id) => ({
    params: { locale: id === DEFAULT_LANGUAGE ? undefined : id },
  }));
}

export function removeLanguageFromPath(pathname: string) {
  const [pathLocale] = pathname.split("/").filter(Boolean);

  if (!pathLocale || !pathHasLocale(pathLocale)) {
    return pathname;
  }

  return pathname.replace(`/${pathLocale}`, "") || "/";
}
