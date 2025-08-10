import Queue from "./Queue";
declare class QueueParallel extends Queue {
    constructor(concurrency?: number);
    _processQueue(): Promise<void>;
}
export default QueueParallel;
