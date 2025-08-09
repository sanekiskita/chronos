import Queue from "./Queue";

class QueueParallel extends Queue {

  constructor(concurrency = 2) {
    super();
    this.concurrency = concurrency;
  }
}

export default QueueParallel
