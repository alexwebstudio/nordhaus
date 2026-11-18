# Фото для NORDHAUS

## Что уже есть (`public/images/raw`)

| Файл | Что на фото | Где стоит сейчас |
|---|---|---|
| `concrete-frame-sky.jpg` (736×1104) | бетонный каркас снизу вверх, небо | **временно в Hero** (пока нет #1) |
| `blueprints-hands.jpg` (736×1030) | руки и чертежи | «3 шага» → шаг 1 |
| `helmet.jpg` (736×981) | белая каска на бетоне | «3 шага» → шаг 2 |
| `concrete-chair.jpg` (675×1200) | бетонная стена, кресло, свет | «3 шага» → шаг 3 |
| `concrete-zigzag.jpg` (736×1308) | бетонные консоли | фон секции «Отзывы» (под стеклянными карточками) |
| `tower-bw.jpg` (736×1308) | ч/б башня в лесах | резерв: `/about`, 404 |

Там, где нужны дома (оффер, каталог, объекты, финальный CTA), сейчас стоят **SVG-иллюстрации** (`components/ui/HouseArt.tsx`). Замена — одна строка в `data/home.ts` / `data/catalog.ts`: `{ kind: "photo", src, alt }` вместо `{ kind: "art", ... }`.

**Важно:** все фото 736px по ширине (похоже на превью с Pinterest) и на них нет **каркасных частных домов**. Для hero, каталога, объектов, отзывов и CTA нужны фото ниже.

Общий стиль промптов: *photorealistic, modern frame house, dark metal + natural wood cladding, floor-to-ceiling windows, pine forest, Kazakhstan steppe-forest landscape, soft natural light, architectural photography, 35mm, high detail, no people unless stated, no text, no watermark.*

---

### 1. Hero — ОБЯЗАТЕЛЬНО (самое важное)
- **Размер:** ≥ 2400×1500 (16:10 или 3:2), лучше 3200px.
- **Кадр:** дом строго по центру, фасад фронтально или лёгкие 3/4, дом занимает ~60–70% ширины — так он читается во всех 4 окнах. Сверху запас неба (~25%) — под хедер и параллакс.
- **Свет:** мягкий пасмурный день или золотой час; тон холодный, приглушённый (под графитовый фон).
- **Промпт:**
  `Wide architectural photograph of a modern two-storey frame house, centered, frontal view, dark anthracite metal panels combined with vertical natural larch wood cladding, huge floor-to-ceiling windows, flat roof with overhang, surrounded by tall pine trees, overcast soft light, muted cool tones, calm minimal landscaping, lots of sky above the house, ultra wide 16:10, photorealistic, 8k, no people, no text`

### 2. Оффер — фото дома справа (как в референсе «каркасный дом»)
- 4:5, ≥ 1400×1750. Дом 3/4, дерево + тёмный металл, хвойный лес, день.
- `Photorealistic modern frame house three-quarter view, larch wood facade with black metal frames, balcony with glass railing, pine forest, bright daylight, vertical 4:5, architectural photography`

### 3. Каталог 2026 — 6–8 фото (один проект = одно фото)
- 3:4, ≥ 1200×1600, единый ракурс 3/4, дневной свет, разные формы: барнхаус, двускатная, плоская кровля, с мансардой, одноэтажный, двухэтажный, А-фрейм, с террасой.
- `Photorealistic modern [barnhouse | A-frame | flat-roof | gable-roof with attic] frame house, [N] m², dark metal and wood cladding, panoramic windows, pine forest, daylight, 3:4 vertical, consistent architectural photography style`

### 4. Реализованные объекты — 3+ фото и пары «до/после» для `/projects`
- 4:3, ≥ 1600×1200. «До» — каркас/участок, «После» — готовый дом, **тот же ракурс**.
- До: `Timber frame house under construction, exposed wooden studs and rafters, same camera angle, overcast day, construction site in pine forest`
- После: `The same house finished, dark metal and wood cladding, panoramic windows, landscaping, same camera angle`

### 5. Отзывы — 3–4 фото семей у дома
- 1:1, ≥ 800×800. Семья на террасе своего дома, естественно, не постановочно.
- `Candid photo of a Kazakh family on the wooden terrace of their new modern frame house, warm evening light, natural smiles, documentary style, square`

### 6. Финальный CTA — вечерний дом
- 21:9, ≥ 2400×1030. Дом в сумерках, тёплый свет из окон, слева пустое тёмное пространство под текст.
- `Modern frame house at blue hour, warm interior light glowing through floor-to-ceiling windows, dark wood and metal facade, pine forest silhouettes, house on the right third, dark empty space on the left for text, ultra wide 21:9, photorealistic`

### 7. Технология — разрез стены / процесс
- 4:3, ≥ 1600×1200. Каркас крупным планом: стойки, утеплитель, мембрана.
- `Close-up of a timber frame wall under construction, mineral wool insulation between studs, vapor barrier membrane, clean construction site, soft daylight, technical documentary photo`

### 8. О нас — команда и производство
- 3:2, ≥ 1800×1200: команда на объекте (4–6 человек в униформе), цех с заготовками каркаса.

### 9. Способы оплаты — 4 фото-иконки или 3D
- 1:1, ≥ 600×600, нейтральный серый фон: ключи с брелоком-домиком, калькулятор, документ с печатью, банковская карта. Стиль — мягкий 3D, графит + дерево.
