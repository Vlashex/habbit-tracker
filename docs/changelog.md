# CHANGELOG

Все значимые изменения этого проекта будут документироваться в этом файле.
Формат основан на Keep a Changelog и Semantic Versioning.

## [1.0.0] - 2025-09-03

### Added

- Начальная версия архитектуры: Shell-приложение + MFE-модули (Habit, Pomodoro, Todo, Analytics).
- Shared UI (только презентационный код) и Shared Libs (Event Bus, SyncManager, idb, contracts).
- Контракты Event Bus (все события с версией `:v1`):
  - `timer:started:v1`, `timer:completed:v1` (Pomodoro → Habit/Analytics)
  - `habits:data:request:v1`, `habits:data:response:v1` (Habit ↔ Analytics)
  - `todo:task:completed:v1` (Todo → Analytics)
  - `ui:show:notification:v1`, `ui:toggle:theme:v1` (все MFE-модули ↔ Shell)
- GraphQL контракты для Habit, Todo, Analytics.
- Правила деплоя: каждый MFE как `remoteEntry.js`, Shell подхватывает runtime.

### Fixed

- Унификация терминов: «Shell-приложение», «MFE-модули», «Shared UI», «Shared Libs».
- Ограничение ответственности: Shell хранит только глобальные user/session данные; Shared UI — только презентационный код; Shared Libs — только инфраструктура; доменные модели в shared запрещены.
- Методологии: в каждом MFE действует FSD + Гексагональная архитектура; UI → API без слоя модели запрещено.

### Deprecated

- Нет.

### Removed

- Нет.

### Security

- Нет изменений.

---

Политика версионирования контрактов:

- Каждое изменение контракта (Event Bus, GraphQL) получает новую версию (`:v2`, `v1 -> v2`).
- Старые версии поддерживаются в течение как минимум одной минорной версии релиза.
- Деприкации и удаление старых версий фиксируются в этом файле.
