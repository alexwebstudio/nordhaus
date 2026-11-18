/**
 * Визуал: только реальное фото из public/images/raw или нейтральный плейсхолдер.
 * Плейсхолдер хранит ключ подписи (messages) и требования к фото — для IMAGES_NEEDED.md.
 */
export type Visual =
  | { kind: "photo"; src: string; altKey: string; position?: string }
  | { kind: "placeholder"; labelKey: string; ratio: string; size: string };
