// Minimal IndexedDB wrapper for offline-first storage

export type IdbConfig = {
  dbName: string;
  storeName: string;
};

export class SimpleIdb<TValue extends { id: string }> {
  private dbPromise: Promise<IDBDatabase>;

  constructor(private readonly config: IdbConfig) {
    this.dbPromise = this.open();
  }

  private open(): Promise<IDBDatabase> {
    const { dbName, storeName } = this.config;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async withStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.dbPromise;
    return db
      .transaction(this.config.storeName, mode)
      .objectStore(this.config.storeName);
  }

  async getAll(): Promise<TValue[]> {
    const store = await this.withStore("readonly");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as TValue[]);
      request.onerror = () => reject(request.error);
    });
  }

  async put(value: TValue): Promise<void> {
    const store = await this.withStore("readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(value);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: string): Promise<void> {
    const store = await this.withStore("readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
