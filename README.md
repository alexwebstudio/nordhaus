# NORDHAUS — сайт-прототип застройщика каркасных домов

Портфолио-кейс **AlexWebStudio**. Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-intl · GSAP (ScrollTrigger) · Lenis.

## Запуск

```bash
npm install
npm run dev          # http://localhost:3000 → /ru
npm run build        # production-сборка
npm start
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```

## Деплой на Vercel

1. Залить репозиторий на GitHub.
2. Vercel → **Add New Project** → импортировать репозиторий. Framework определится сам (Next.js), настройки по умолчанию.
3. После деплоя поменять домен в `config/site.ts` → `site.url` (используется в sitemap, canonical, OG и JSON-LD) и передеплоить.

Переменные окружения не нужны. Заявки (квиз и форма контактов) приходят в `POST /api/lead` и сейчас пишутся в лог функции на Vercel — TODO: отправка в Telegram-бота (токен и chat id → Environment Variables).

## Структура

| Что | Где |
|---|---|
| Страницы (`/ru/...`) | `app/[locale]/*` — главная, каталог, проект, технология, проекты, оплата ×4, о нас, контакты, 404, `logo-preview` |
| Все тексты сайта | `messages/ru.json` (в компонентах строк нет) |
| Числа, цены, слаги, фото, координаты (демо) | `data/*.ts` |
| Бренд, телефоны, меню | `config/site.ts` |
| Локали | `i18n/routing.ts` |
| Motion-стандарт (easing, длительности) | `lib/motion.ts` + CSS-переменные в `app/globals.css` |
| Шрифты (self-hosted, урезаны по символам) | `lib/fonts.ts`, `app/fonts/` |

## Казахская версия

Инфраструктура готова: роуты `/kz/...`, переключатель RU/KZ в хедере (появится автоматически), hreflang, шрифт с казахскими буквами.
Чтобы включить: добавить `messages/kz.json` (та же структура, что `ru.json`) и вернуть `"kz"` в `locales` в `i18n/routing.ts`.
В Unbounded нет казахских букв, поэтому заголовки на KZ автоматически набираются Onest.

## Фото

Используются только фото из `public/images/raw`. Где фото нет — нейтральный графитовый плейсхолдер с подписью и размером (hero, оффер, каталог, проекты, CTA). Что снять или найти — в [`IMAGES_NEEDED.md`](IMAGES_NEEDED.md).
Замена — одна строка в `data/*.ts`: `{ kind: "photo", src, altKey }` вместо `{ kind: "placeholder", ... }`.

## Логотип

Текстовый wordmark, 3 варианта — `/ru/logo-preview`. Сейчас стоит A; переключается константой `DEFAULT_WORDMARK` в `components/layout/Wordmark.tsx`.

## Эффекты

- `components/effects/TextFlip.tsx`, `BlurIn.tsx` — порты эффектов AW-Flow «3D Flip» и «Blur In» (aw-flow.alexwebstudio.ru). Без JS текст видим: скрытое состояние включает скрипт.
- `components/effects/Reveal.tsx` — каскадное появление карточек.
- Прелоадер (`components/layout/Preloader.tsx`) — Web Animations API, ~3 с; повторно в сессии ~0.8 с; при переходах не показывается.
- GSAP и Lenis грузятся лениво после первого кадра (`lib/gsap.ts` → `useGsap`).
- `prefers-reduced-motion` учитывается везде.
