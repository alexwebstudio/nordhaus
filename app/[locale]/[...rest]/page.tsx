import { notFound } from "next/navigation";

/** Любой неизвестный путь внутри локали → локализованная 404 (app/[locale]/not-found.tsx). */
export default function CatchAll() {
  notFound();
}
