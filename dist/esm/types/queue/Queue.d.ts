import { AnyFunc } from "../interface/IFunction";
import { IQueue, IQueueTask } from "../interface/IQueue";
import AQueue from "./QueueAbstract";
declare class Queue extends AQueue<IQueueTask[]> implements IQueue {
    protected queues: IQueueTask[];
    constructor();
    protected _getQueue(): IQueueTask | undefined;
    add(task: AnyFunc): Promise<unknown>;
    clear(): void;
    size(): number;
}
export default Queue;
