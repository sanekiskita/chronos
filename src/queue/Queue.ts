import { AnyFunc } from "../interface/IFunction";
import { IQueue, IQueueTask } from "../interface/IQueue";
import AQueue from "./QueueAbstract";

class Queue extends AQueue<IQueueTask[]> implements IQueue {

  protected queues: IQueueTask[] = [];

  constructor() {
    super();
  }

  protected _getQueue() {
    return this.queues.shift();
  }

  public add(task: AnyFunc) {
    return new Promise((resolve, reject) => {
      this.queues.push({ task, resolve, reject });
      this._processQueue();
    });
  }

  public clear() {
    this.queues.length = 0;
  }

  public size() {
    return this.queues.length;
  }
}

export default Queue;
