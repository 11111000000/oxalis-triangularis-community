# Technical architecture

## Архитектурный принцип

**Сайт должен быть статическим, данные — проверяемыми, медиа — внешними, модерация — прозрачной.**

Мы не строим собственную социальную сеть. Мы собираем качественный центр знания и используем существующие инструменты для общения, ревью и публикации.

## MVP

```text
Contributor
  ↓ form / GitHub Issue / PR
Moderation queue on GitHub
  ↓ human review + agent checks
Data files in Git
  ↓ static render
Public website
```

## Компоненты

### 1. Static site

На старте: `site/index.html` + `site/styles.css`.

Причина: мгновенный деплой на GitHub Pages, Netlify или Vercel без сборки и без зависимостей.

Позже можно перейти на Astro/Eleventy/Hugo, если появится много страниц и данных. Переход не должен менять философию: контент остаётся в Git, медиа вне Git.

### 2. Canonical schema

`data/schema.yaml` — источник правды для записей. По ней строятся:

- форма подачи;
- проверка CI;
- модерационный чеклист;
- структура публичной страницы сорта.

Для раннего этапа отдельный скрипт проверяет базовые поля и ищет дубли `id` / `latin_name` в `data/records/*.json`.

### 3. Contribution flow

MVP:

- GitHub Issue template для предложений;
- Pull Request для доверенных участников;
- ручная модерация.

Следующий шаг:

- простая web-form, которая создаёт Issue/PR через GitHub API;
- серверless webhook для уведомлений в Telegram/Matrix/Discourse.

### 4. Media storage

Фото не хранятся в Git. В записи сохраняются:

- URL;
- автор;
- лицензия;
- источник;
- дата загрузки/проверки.

Возможные хранилища: Cloudinary, S3-compatible storage, Cloudflare Images, GitHub Releases для небольшого MVP.

### 5. Agent-assisted development

Агенты используются для:

- проверки схемы;
- поиска дублей;
- подготовки черновиков описаний;
- ревью PR;
- генерации changelog;
- поиска противоречий в правилах.

Агенты не должны:

- публиковать без человеческого review;
- хранить секреты;
- автоматически банить людей;
- выполнять destructive git operations без подтверждения.

## Dev environment

Для удобной локальной работы используются:

- `flake.nix` — минимальный dev shell;
- `.envrc` — вход через `direnv`;
- `justfile` — короткие команды.

### Команды

- `direnv allow` — разрешить окружение;
- `nix develop` — открыть shell;
- `just help` — показать команды;
- `just check` — полный локальный контроль;
- `just serve` — запустить сайт;
- `just status` — посмотреть состояние репозитория.

## CI-проверки будущего репозитория

Минимум:

- проверка отсутствия `.crew/`, `node_modules/`, больших медиа;
- проверка, что `data/schema.yaml` существует;
- markdown link check;
- проверка формата записей;
- smoke-тест статического сайта.

## Деплой

Рекомендуемый порядок:

1. GitHub repository.
2. GitHub Pages или Netlify.
3. Protected main branch.
4. PR preview для изменений сайта.
5. Только затем — submit form/serverless.

## Анти-цели

Мы не делаем на старте:

- собственную авторизацию;
- собственную социальную ленту;
- тяжёлую админку;
- хранение изображений в Git;
- сложный backend;
- автоматические решения по спорным ботаническим вопросам.
