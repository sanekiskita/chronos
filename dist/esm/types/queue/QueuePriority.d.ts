import { AnyFunc } from "../interface/IFunction";
import { IQueuePriority, IQueueTask, IPriority } from "../interface/IQueue";
import AQueue from "./QueueAbstract";
declare class QueuePriority extends AQueue<Record<IPriority, IQueueTask[]>> implements IQueuePriority {
    protected queues: Record<IPriority, IQueueTask[]>;
    protected _getQueue(): IQueueTask | undefined;
    add(task: AnyFunc, priority?: IPriority): Promise<unknown>;
    clear(priority?: IPriority): void;
    size(priority?: IPriority): number;
}
export default QueuePriority;
