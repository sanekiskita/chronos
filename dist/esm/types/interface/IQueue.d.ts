import { AnyFunc } from "./IFunction";
export interface IQueue {
    add(task: AnyFunc): Promise<ReturnType<AnyFunc>>;
    clear(): void;
    size(): number;
    getActiveCount(): number;
}
export interface IQueuePriority extends IQueue {
    add(task: AnyFunc, priority?: IPriority): Promise<ReturnType<AnyFunc>>;
}
export interface IQueueTask {
    task: AnyFunc;
    resolve: (value: ReturnType<AnyFunc>) => void;
    reject: (value: ReturnType<AnyFunc>) => void;
}
export type IPriority = 'high' | 'normal' | 'low';
