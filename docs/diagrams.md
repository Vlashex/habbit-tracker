## docs/diagrams.md

````markdown
# Диаграммы архитектуры Polyglot Habit & Productivity Tracker

Этот документ содержит все ключевые диаграммы проекта:

- Компонентная архитектура
- Взаимодействие через Event Bus
- Цикл офлайн-синхронизации
- Развертывание и Runtime Federation

---

## 1. Компонентная архитектура (Shell + MFE)

```mermaid
flowchart TB
    subgraph Shell["Shell-приложение (React, TS, PWA)"]
        Router[Router]
        EventBus[Event Bus]
        Auth[Auth / Profile]
        Theme[UI Theme]
    end

    subgraph Habit["MFE-mfe-habit-tracker (Vue 3, Pinia)"]
        HabitUI[UI Layer]
        HabitModel[Domain Logic]
        HabitStore[Local Store]
    end

    subgraph Timer["MFE-mfe-pomodoro-timer (Solid.js, Signals)"]
        TimerUI[UI Layer]
        TimerModel[Timer Logic]
    end

    subgraph Todo["MFE-mfe-todo-lists (React, Zustand)"]
        TodoUI[UI Layer]
        TodoModel[Domain Logic]
    end

    subgraph Analytics["MFE-mfe-analytics (React, Apollo)"]
        AnalyticsUI[Charts UI]
        AnalyticsModel[Data Analysis]
    end

    Shell --> Habit
    Shell --> Timer
    Shell --> Todo
    Shell --> Analytics

    Habit <--> EventBus
    Timer <--> EventBus
    Todo <--> EventBus
    Analytics <--> EventBus
```
````

---

## 2. Взаимодействие через Event Bus

```mermaid
sequenceDiagram
    participant Habit as Habit Tracker (Vue)
    participant Timer as Pomodoro Timer (Solid)
    participant Todo as Todo Lists (React)
    participant Analytics as Analytics Reports (React)
    participant Shell as Shell (React, PWA)
    participant Bus as Event Bus

    Note over Habit,Analytics: Все коммуникации происходят только через Event Bus

    Timer->>Bus: emit("timer:started:v1", { duration, startedAt })
    Bus-->>Habit: on("timer:started:v1")

    Timer->>Bus: emit("timer:completed:v1", { habitId, completedAt })
    Bus-->>Habit: on("timer:completed:v1")
    Bus-->>Analytics: on("timer:completed:v1")

    Habit->>Bus: emit("habits:data:response:v1", Habit[])
    Bus-->>Analytics: on("habits:data:response:v1")

    Shell->>Bus: emit("ui:show:notification:v1", { type, message })
    Bus-->>Habit: on("ui:show:notification:v1")
    Bus-->>Todo: on("ui:show:notification:v1")
    Bus-->>Analytics: on("ui:show:notification:v1")
```

---

## 3. Цикл офлайн-синхронизации (SyncManager Flow)

```mermaid
flowchart TD
    U[Пользователь] --> UI[UI Layer (MFE-модуль)]
    UI --> Store[Локальное состояние (Pinia/Zustand/Signals)]
    Store --> DB[IndexedDB (через idb)]
    DB --> Sync[SyncManager (Очередь мутаций)]

    Sync -->|Онлайн| API[GraphQL API (Apollo Server)]
    Sync -->|Офлайн| Queue[(Очередь)]

    Queue -->|Восстановление сети| Sync

    API --> Conflict[Resolver конфликтов]
    Conflict --> DB
    Conflict --> Store
    Conflict --> UI
```

---

## 4. Развертывание и Runtime Federation

```mermaid
flowchart TD
    subgraph Dev["CI/CD Pipeline (GitHub Actions)"]
        A1[Commit to main branch]
        A2[Build MFE-модуль]
        A3[Build Shell]
        A4[Publish artifacts]
    end

    subgraph Deploy["Deployment"]
        CDN1[CDN: habit.example.com/remoteEntry.js]
        CDN2[CDN: timer.example.com/remoteEntry.js]
        CDN3[CDN: analytics.example.com/remoteEntry.js]
        CDN4[CDN: todo.example.com/remoteEntry.js]
        ShellApp[Main domain: app.example.com]
    end

    subgraph Runtime["Runtime Federation"]
        Browser[User Browser / PWA]
    end

    A1 --> A2 --> CDN1 & CDN2 & CDN3 & CDN4
    A1 --> A3 --> ShellApp
    A4 --> Deploy

    Browser --> ShellApp
    ShellApp -.remoteEntry.js.-> CDN1
    ShellApp -.remoteEntry.js.-> CDN2
    ShellApp -.remoteEntry.js.-> CDN3
    ShellApp -.remoteEntry.js.-> CDN4
```
