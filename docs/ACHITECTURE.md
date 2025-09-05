# ARCHITECTURE.md

**Project:** Polyglot Habit & Productivity Tracker (PWA + MFE)  
**Version:** 1.0.0  
**Date:** 03.09.2025

---

## 1. Архитектурное видение

Система реализована как **прогрессивное веб-приложение (PWA)** с архитектурным стилем **микрофронтенды (MFE)**.  
Каждый **MFE-модуль** отвечает за свой bounded context и деплоится независимо, а **Shell-приложение** выполняет роль оркестратора.

### Ключевые принципы

- **Полиглотность**: разные **MFE-модули** построены на разных фреймворках (React, Vue, Solid) для showcase.
- **Оффлайн-first**: действия пользователя не блокируются сетью, данные синхронизируются через IndexedDB + SyncManager.
- **Событийное взаимодействие**: интеграция только через Event Bus.
- **FSD + Гексагональная архитектура**: разделение бизнес-логики, UI и адаптеров внутри каждого MFE.
- **Независимый деплой**: каждый MFE поставляется как `remoteEntry.js` и подключается Shell через Module Federation.
- **Запрещены прямые зависимости между MFE**: любые интеграции строго через события и контракты.
- **Единообразные термины**: используются термины «Shell-приложение», «MFE-модули», «Shared UI», «Shared Libs».

---

## 2. Верхнеуровневая структура

```

polyglot-habit-tracker/
├─ shell/               # Orchestrator, Router, PWA, глобальные user/session данные
├─ mfe-habit-tracker/   # Привычки (Vue 3 + Pinia)
├─ mfe-pomodoro-timer/  # Таймер Pomodoro (Solid.js + Signals)
├─ mfe-todo-lists/      # Списки дел (React + Zustand)
├─ mfe-analytics/       # Отчёты и графики (React + Apollo)
├─ shared-ui/           # Дизайн-система (Tailwind, Radix UI)
└─ shared-libs/         # Event Bus, SyncManager, idb

```

---

## 3. Shell-приложение

**Назначение**:

- Хост для всех **MFE-модулей**.
- Управление роутингом, авторизацией и PWA-механиками.
- Предоставление глобальных сервисов (тема, профиль, Event Bus).

**Ограничения**:

- Shell **не хранит бизнес-данные доменов** (habits, tasks, timers) и **не содержит бизнес-логику доменов**.
- Допустимо хранить только глобальные user/session данные: аутентификация, профиль, тема, локализация, разрешения.

**Технологии**:

- React + TS
- Vite (PWA)
- Webpack Module Federation (runtime интеграция)

**Методологии**:

- FSD: глобальные процессы (`auth`, `theme`), страницы (`app`), общие модули (`shared`).
- Hexagonal: ядро (модели пользователя, токены), адаптеры (GraphQL, localStorage). Прямые обращения UI → API без слоя модели/порта запрещены.

---

## 4. MFE-модули

Каждый **MFE-модуль** обязан реализовывать **FSD + Hexagonal**.  
Нарушение изоляции (например, UI → API без слоя модели/портов/адаптеров) строго запрещено.

### 4.1. Habit Tracker (mfe-habit-tracker)

**Назначение**:  
CRUD для привычек, прогресс, статистика.

**Технологии**:

- Vue 3 + TS
- Pinia (state management)

**Методологии**:

- FSD: `features/add-habit`, `entities/habit`, `pages/dashboard`.
- Hexagonal: ядро — модели Habit, адаптеры — GraphQL API, IndexedDB. Прямые импорты из других MFE запрещены; взаимодействие только через события.

---

### 4.2. Pomodoro Timer (mfe-pomodoro-timer)

**Назначение**:  
Управление сессиями Pomodoro, события старта/остановки, интеграция с привычками.

**Технологии**:

- Solid.js + TS
- Signals для реактивного состояния

**Методологии**:

- Минимальная доменная логика, Event Bus как основной канал интеграции.
- Hexagonal: ядро — логика таймера, адаптеры — UI и события. Напрямую данные других доменов не читаются.

---

### 4.3. Todo Lists (mfe-todo-lists)

**Назначение**:  
Списки задач, чеклисты, связь с привычками.

**Технологии**:

- React + TS
- Zustand (состояние)

**Методологии**:

- FSD: `features/add-task`, `entities/task`, `pages/todos`.
- Hexagonal: ядро — модели задач, адаптеры — API, Event Bus. Общение с аналитикой — через события.

---

### 4.4. Analytics (mfe-analytics)

**Назначение**:  
Графики и отчёты по привычкам и задачам.

**Технологии**:

- React + TS
- Apollo Client (GraphQL)

**Методологии**:

- FSD: `features/render-chart`, `pages/reports`.
- Hexagonal: ядро — агрегация данных, адаптеры — GraphQL запросы, UI-графики. Источники данных — события и GraphQL, не прямые импорты.

---

## 5. Shared-модули

### 5.1. Shared UI

- TailwindCSS + Radix UI.
- Компоненты в Storybook.
- Содержит **только презентационный код**.
- Бизнес-логика и доменные модели в Shared UI запрещены.

### 5.2. Shared Libs

- **Event Bus**: pub/sub для событий между **MFE-модулями**.
- **SyncManager**: очередь офлайн-мутаторов для GraphQL.
- **idb**: IndexedDB через обёртку.
- Типизация контрактов событий и API: `shared-libs/contracts` (`zod` + TypeScript).
- Содержит **только инфраструктурный код**.
- Доменные модели в Shared Libs запрещены.

---

## 6. Взаимодействие доменов

Все кросс-доменные интеграции строго через **Event Bus**.  
Прямые импорты одного **MFE-модуля** в другой запрещены.

- Pomodoro → Habit Tracker: `timer:started:v1`, `timer:completed:v1`.
- Habit Tracker ↔ Analytics: `habits:data:request:v1`, `habits:data:response:v1`.
- Todo Lists → Analytics: `todo:task:completed:v1`.
- Все **MFE-модули** → Shell и взаимно: `ui:show:notification:v1`, `ui:toggle:theme:v1`.

**Контракты событий и API зафиксированы в**: [`contracts.md`](./contracts.md).

---

## 7. Паттерны и практики

- **Event-driven architecture**: все кросс-доменные взаимодействия через события.
- **FSD + Hexagonal**: для каждого **MFE-модуля**.
- **Polyrepo CI/CD**: GitHub Actions, независимый деплой **MFE-модулей**.
- **Оффлайн-first**: IndexedDB + очередь мутаций.
- **Типизация контрактов**: все события и API фиксируются через `zod` + TypeScript в `shared-libs/contracts`.
- **Запрещено**: нарушение границ слоёв (UI → API), прямые импорты между **MFE-модулями**, размещение доменных моделей в Shared.

---

## 8. Развёртывание

1. Каждый **MFE-модуль** собирается в `remoteEntry.js`.
2. Публикация на CDN/поддомен.
3. Shell-приложение подхватывает новые версии runtime (Module Federation dynamic remotes).
4. Деплой через GitHub Actions.
5. Независимый деплой означает, что обновление **MFE-модуля** не требует пересборки Shell при условии соблюдения контрактов.

---

## 9. Технологический стек по модулям

| Модуль            | Стек                                           |
| ----------------- | ---------------------------------------------- |
| Shell-приложение  | React, TS, Vite PWA, Webpack Federation        |
| Habit Tracker     | Vue 3, TS, Pinia                               |
| Pomodoro Timer    | Solid.js, TS, Signals                          |
| Todo Lists        | React, TS, Zustand                             |
| Analytics Reports | React, TS, Apollo Client                       |
| Shared UI         | TailwindCSS, Radix UI, Storybook               |
| Shared Libs       | TypeScript, idb, custom Event Bus, SyncManager |
| API               | GraphQL, Apollo Server                         |
| Quality           | ESLint (airbnb + custom), Prettier, Stylelint  |

---

```

```
