// Simple typed Event Bus for cross-MFE communication.
// Contracts for event names and payloads are defined in shared-libs/contracts/events.ts

export type EventPayloadMap = Record<string, unknown>;

type Listener<T> = (payload: T) => void;

class EventBus<Events extends EventPayloadMap> {
  private listeners: Map<keyof Events, Set<Listener<any>>> = new Map();

  on<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): () => void {
    let set = this.listeners.get(eventName);
    if (!set) {
      set = new Set();
      this.listeners.set(eventName, set);
    }
    set.add(listener as Listener<any>);
    return () => this.off(eventName, listener as Listener<any>);
  }

  off<EventName extends keyof Events>(
    eventName: EventName,
    listener: Listener<Events[EventName]>
  ): void {
    const set = this.listeners.get(eventName);
    if (set) {
      set.delete(listener as Listener<any>);
      if (set.size === 0) this.listeners.delete(eventName);
    }
  }

  emit<EventName extends keyof Events>(
    eventName: EventName,
    payload: Events[EventName]
  ): void {
    const set = this.listeners.get(eventName);
    if (!set) return;
    for (const listener of set) {
      try {
        listener(payload);
      } catch (error) {
        // Avoid breaking the bus if one listener throws
        console.error(
          `[event-bus] listener error for ${String(eventName)}`,
          error
        );
      }
    }
  }
}

// Default global bus with loose typing. Consumers can re-export with their own Events map.
// eslint-disable-next-line @typescript-eslint/ban-types
export const eventBus = new EventBus<Record<string, any>>();

export default eventBus;
