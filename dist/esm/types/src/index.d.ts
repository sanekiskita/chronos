import QueueParallel from './queue/QueueParallel';
import QueuePriority from './queue/QueuePriority';
import Queue from './queue/Queue';
declare const _default: {
    mixins: {
        debounce(func: import("./interface/IFunction").AnyFunc, wait: number, onlyOne?: boolean): (...args: Parameters<import("./interface/IFunction").AnyFunc>) => Promise<ReturnType<import("./interface/IFunction").AnyFunc>>;
        onceAtATime(func: import("./interface/IFunction").AnyFunc, rejectOnce?: any): (...args: Parameters<import("./interface/IFunction").AnyFunc>) => Promise<ReturnType<import("./interface/IFunction").AnyFunc>>;
        throttle(func: import("./interface/IFunction").AnyFunc, limit: number): (...args: Parameters<import("./interface/IFunction").AnyFunc>) => void;
    };
    Queue: typeof Queue;
    QueueParallel: typeof QueueParallel;
    QueuePriority: typeof QueuePriority;
};
export default _default;
