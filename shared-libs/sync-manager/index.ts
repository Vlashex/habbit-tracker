// Minimal SyncManager to queue GraphQL mutations when offline

type MutationJob = {
  key: string;
  url: string;
  body: unknown;
  createdAt: number;
};

export class SimpleSyncManager {
  private queue: MutationJob[] = [];
  private isProcessing = false;

  enqueue(job: Omit<MutationJob, "createdAt">): void {
    this.queue.push({ ...job, createdAt: Date.now() });
    this.process().catch(() => {});
  }

  async process(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      while (this.queue.length > 0) {
        const job = this.queue[0];
        try {
          await fetch(job.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job.body),
          });
          this.queue.shift();
        } catch (e) {
          // Network error: stop and retry later
          break;
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const syncManager = new SimpleSyncManager();
