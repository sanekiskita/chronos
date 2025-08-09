import { IQueueTask } from "../interface/IQueue";

export default abstract class AQueue<T extends any> {
  protected abstract queues: T;
  protected activeCount: number = 0;
  protected concurrency: number = 1;

  protected _canRunProcess(): boolean {
    return this.activeCount < this.concurrency;
  }

  protected abstract _getQueue(): IQueueTask|undefined

  protected async _runProcess(queue: IQueueTask): Promise<void> {
    const { task, resolve, reject } = queue;
    this.activeCount++;

    try {
      const result = await task();
      resolve(result);
    } catch (e) {
      reject(e);
    } finally {
      this.activeCount--;
      this._processQueue();
    }
  }

  protected _processQueue(): void {
    // Wait for all synchronous tasks to be added before processing
    setTimeout(() => {
      // Process as many tasks as concurrency allows
      while (this._canRunProcess()) {
        const queue = this._getQueue();
        if (!queue) {
          break;
        }
        this._runProcess(queue);
      }
    }, 0);
  }

  public getActiveCount() {
    return this.activeCount;
  }
}