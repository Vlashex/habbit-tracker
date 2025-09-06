import { defineStore } from "pinia";
import { SimpleIdb } from "../../../shared/adapters/idb";
import eventBus from "../../../../shared-libs/event-bus";

export type Habit = {
  id: string;
  name: string;
  createdAt: string;
  progress: number;
};

type State = {
  habits: Habit[];
  isLoading: boolean;
};

const idb = new SimpleIdb<Habit>({ dbName: "mfe-habits", storeName: "habits" });

export const useHabitStore = defineStore("habitStore", {
  state: (): State => ({ habits: [], isLoading: false }),
  actions: {
    async load(timeframe: "day" | "week" | "month" = "day") {
      this.isLoading = true;
      try {
        const all = await idb.getAll();
        this.habits = all;
        eventBus.emit("habits:data:response:v1", {
          habits: this.habits,
        } as any);
      } finally {
        this.isLoading = false;
      }
    },
    async add(name: string) {
      const habit: Habit = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        progress: 0,
      };
      await idb.put(habit);
      this.habits.push(habit);
      eventBus.emit("ui:show:notification:v1", {
        type: "success",
        message: "Привычка добавлена!",
      } as any);
    },
    async complete(id: string) {
      const idx = this.habits.findIndex((h) => h.id === id);
      if (idx === -1) return;
      const updated: Habit = {
        ...this.habits[idx],
        progress: Math.min(1, this.habits[idx].progress + 0.1),
      };
      await idb.put(updated);
      this.habits.splice(idx, 1, updated);
    },
    subscribeToEvents() {
      // Respond to analytics data requests
      eventBus.on("habits:data:request:v1" as any, () => {
        eventBus.emit("habits:data:response:v1", {
          habits: this.habits,
        } as any);
      });
      // Handle timer completion to progress a habit
      eventBus.on("timer:completed:v1" as any, (payload: any) => {
        const habitId = payload?.habitId as string | null;
        if (habitId) this.complete(habitId);
      });
    },
  },
});
