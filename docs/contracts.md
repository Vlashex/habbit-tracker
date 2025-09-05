# CONTRACTS.md

**Project:** Polyglot Habit & Productivity Tracker  
**Version:** 1.0.0  
**Date:** 03.09.2025

---

## 1. Event Bus — контракты

Все события являются неизменяемыми сообщениями.  
События версионируются (`v1`, `v2`) и публикуются в **event namespace**, чтобы избежать конфликтов.

### Общие правила

- События оформляются как `<namespace>:<eventName>:<version>`.
- Payload валидируется через `zod` схемы в `shared-libs/contracts`.
- **MFE-модули** подписываются только на события, описанные здесь.
- Запрещены события без версии.

---

### 1.1. Pomodoro Timer → Habit Tracker

#### `timer:started:v1`

```ts
{
  duration: number; // ms
  startedAt: string; // ISO timestamp
}
```

#### `timer:completed:v1`

```ts
{
  habitId: string | null;
  completedAt: string; // ISO timestamp
}
```

---

### 1.2. Habit Tracker ↔ Analytics

#### `habits:data:request:v1`

```ts
{
  timeframe: "day" | "week" | "month";
}
```

#### `habits:data:response:v1`

```ts
{
  habits: Habit[];
}

type Habit = {
  id: string;
  name: string;
  createdAt: string;
  progress: number; // 0–1
};
```

---

### 1.3. UI & Notifications

#### `ui:show:notification:v1`

```ts
{
  type: "success" | "error" | "info";
  message: string;
}
```

#### `ui:toggle:theme:v1`

```ts
{
  theme: "light" | "dark" | "system";
}
```

---

### 1.4. Todo Lists → Analytics

#### `todo:task:completed:v1`

```ts
{
  taskId: string;
  habitId?: string; // optional link to habit
  completedAt: string; // ISO timestamp
}
```

---

## 2. GraphQL — контракты

### 2.1. Habit Tracker

```graphql
type Habit {
  id: ID!
  name: String!
  createdAt: DateTime!
  progress: Float!
}

type Query {
  habits(timeframe: String!): [Habit!]!
}

type Mutation {
  addHabit(name: String!): Habit!
  completeHabit(id: ID!): Habit!
}
```

---

### 2.2. Todo Lists

```graphql
type Todo {
  id: ID!
  title: String!
  completed: Boolean!
  habitId: ID
}

type Query {
  todos: [Todo!]!
}

type Mutation {
  addTodo(title: String!, habitId: ID): Todo!
  completeTodo(id: ID!): Todo!
}
```

---

### 2.3. Analytics

```graphql
type Report {
  id: ID!
  timeframe: String!
  habits: [Habit!]!
  todos: [Todo!]!
}

type Query {
  report(timeframe: String!): Report!
}
```

---

## 3. Версионирование и миграции

- Каждое новое событие или API-контракт получает версию (`:v2`).
- Старые версии поддерживаются до их официальной деприкации.
- Деприкации фиксируются в `changelog.md`.
- Контракты считаются источником истины; несоответствие реализации недопустимо.

---

## 4. Примеры использования

### Отправка события из Habit Tracker

```ts
eventBus.emit("ui:show:notification:v1", {
  type: "success",
  message: "Привычка добавлена!",
});
```

### Подписка на событие в Analytics

```ts
eventBus.on("habits:data:response:v1", (payload) => {
  renderChart(payload.habits);
});
```

```

```
