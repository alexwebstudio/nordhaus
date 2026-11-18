/** Название бренда — меняется здесь одной константой. Тексты меню — messages/*.json → nav. */
export const BRAND = "NORDHAUS";

export const site = {
  brand: BRAND,
  url: "https://nordhaus.vercel.app",
  phone: "+7 (700) 000-00-00", // demo
  phoneHref: "tel:+77000000000", // demo
  whatsapp: "https://wa.me/77000000000", // demo
  telegram: "https://t.me/nordhaus_demo", // demo
  email: "hello@nordhaus.kz", // demo
  developer: { name: "AlexWebStudio", url: "https://alexwebstudio.ru" },
} as const;

/** пункты меню: путь без локали + ключ в messages.nav */
export const nav = [
  { href: "/", key: "home" },
  { href: "/catalog", key: "catalog" },
  { href: "/technology", key: "technology" },
  { href: "/projects", key: "projects" },
  { href: "/payment/mortgage", key: "payment" },
  { href: "/about", key: "about" },
  { href: "/contacts", key: "contacts" },
] as const;
