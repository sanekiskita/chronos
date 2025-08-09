import { AnyFunc } from "../interface/IFunction";
import { IQueuePriority, IQueueTask, IPriority } from "../interface/IQueue";
import AQueue from "./QueueAbstract";

class QueuePriority extends AQueue<Record<IPriority, IQueueTask[]>> implements IQueuePriority {
  protected queues: Record<IPriority, IQueueTask[]> = {
    high: [],
    normal: [],
    low: [],
  };
  protected validPriorities: IPriority[] = ['high', 'normal', 'low'];

  protected _getQueue() {
    if (this.queues.high.length) {
      return this.queues.high.shift();
    }

    if (this.queues.normal.length) {
      return this.queues.normal.shift();
    }

    if (this.queues.low.length) {
      return this.queues.low.shift();
    }

    return undefined;
  }

  add(task: AnyFunc, priority: IPriority = "normal") {
    return new Promise((resolve, reject) => {

      if (!this.validPriorities.includes(priority)) {
        console.error(`Invalid priority: ${priority}`);
        priority = 'normal';
      }

      this.queues[priority].push({ task, resolve, reject });
      this._processQueue();
    });
  }

  clear(priority?: IPriority) {
    if (priority) {
      this.queues[priority].length = 0;
      return;
    }

    this.queues.high.length = 0;
    this.queues.normal.length = 0;
    this.queues.low.length = 0;
    return;
  }

  size(priority?: IPriority) {
    if (priority) {
      return this.queues[priority].length;
    }

    return this.queues.high.length + this.queues.normal.length + this.queues.low.length;
  }
}

export default QueuePriority;
