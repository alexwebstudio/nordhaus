import type { ReactNode } from "react";

/** Корневой layout — проход насквозь: <html> рендерит app/[locale]/layout.tsx (свой lang для каждой локали). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
