# IndexNow

Используется только `NEXT_PUBLIC_DOMAIN_URL=https://obliviontattoo.xyz`.
Существующий `INDEXNOW_KEY` сохранён в `.env.local`. Добавьте то же значение
в окружение production-хостинга. Не создавайте новый ключ при каждом деплое.
Env загружаются в порядке Next.js: окружение процесса, `.env.production.local`,
`.env.local`, `.env.production`, `.env` (при другом NODE_ENV используется этот режим).

`pnpm build` сохраняет существующие Prisma/Next.js сборку и подготовку MapLibre.
В `prebuild` создаётся `public/<INDEXNOW_KEY>.txt` с точным содержимым ключа.
Файл генерируется из эффективного окружения на каждой сборке; файл и локальные env
игнорируются Git. `enablePrePostScripts: true` в `pnpm-workspace.yaml` включает хуки.

`postbuild` автоматически отправляет URL в Vercel production. На другом
production-хостинге установите `INDEXNOW_ENABLED=true`. Обычная локальная сборка
пропускает отправку. `INDEXNOW_ENABLED=false` отключает её. Vercel preview,
Netlify deploy-preview/branch-deploy и NODE_ENV=development/test не отправляют URL.
Домен проверяется строго: localhost, другие домены и preview URL запрещены.

Перед отправкой проверяются опубликованный `/<INDEXNOW_KEY>.txt` (HTTP 200,
точное совпадение содержимого) и живой `/sitemap.xml`. Поддерживаются вложенные
sitemap index с защитой от циклов. Существующий динамический sitemap остаётся
единственным источником URL, включая записи блога из Prisma.
Внешние URL, дубликаты, query/hash, API, admin и служебные пути исключаются.
Для каждой страницы проверяются HTTP 200, HTML, X-Robots-Tag и meta robots/bingbot
с noindex/none. Редиректы не обходятся и не отправляются.

Таймаут запроса — 10 секунд; до двух повторов при сетевых ошибках,
HTTP 408/429/5xx. POST содержит не более 10 000 URL. Ошибки postbuild/prebuild
IndexNow не меняют результат сборки. Ручная команда возвращает ошибку при сбое.

Сборка выполняется до публикации: postbuild видит текущий опубликованный sitemap.
Новые страницы попадут в отправку после деплоя. На первом деплое публичного ключа
ещё нет — отправка будет пропущена с сообщением. После публикации запускайте
отдельно, без артефактов сборки:

```bash
pnpm indexnow
```

Проверка без POST к IndexNow (GET к опубликованному ключу, sitemap и страницам):

```bash
pnpm indexnow --dry-run
INDEXNOW_DRY_RUN=true pnpm build
```

Проверка URL полностью без сети по уже собранному sitemap Next.js:

```bash
pnpm indexnow --dry-run --local
```

Локальный режим доступен только с dry-run; он не проверяет опубликованный ключ,
HTTP-статусы и runtime noindex. Если sitemap не пререндерен, используйте обычный
dry-run после публикации. Подготовить файл без сборки:
`node --import tsx scripts/indexnow.ts --prepare`.

Список URL выводится в dry-run. Отправка не гарантирует индексацию.
Протокол: https://www.indexnow.org/documentation
