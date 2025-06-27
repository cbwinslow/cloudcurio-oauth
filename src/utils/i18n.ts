const translations = {
  en: () => import("../../locales/en.json"),
  es: () => import("../../locales/es.json"),
};

export async function t(lang: string, key: string): Promise<string> {
  const dict = await translations[lang]?.();
  return dict?.[key] ?? key;
}