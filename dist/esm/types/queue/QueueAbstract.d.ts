import { IQueueTask } from "../interface/IQueue";
export default abstract class AQueue<T extends any> {
    protected abstract queues: T;
    protected activeCount: number;
    protected concurrency: number;
    protected _canRunProcess(): boolean;
    protected abstract _getQueue(): IQueueTask | undefined;
    protected _runProcess(queue: IQueueTask): Promise<void>;
    protected _processQueue(): void;
    getActiveCount(): number;
}
