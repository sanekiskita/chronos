const mixins = {
    /**
     * Debounce method
     * - Delays function execution until `wait` milliseconds have passed since the last call.
     * - The last result is returned to all functions
     *
     * @param {Function} func - Function to execute
     * @param {number} wait - Delay time in milliseconds
     * @param {boolean} onlyOne - Returns result only to the executed function (If false - to all)
     * @return {Function} Wrapped function with debounce
     */
    debounce(func, wait, onlyOne = true) {
        let timeout = undefined;
        const resolves = [];
        return function (...args) {
            return new Promise((resolve) => {
                if (onlyOne) {
                    resolves[0] = resolve;
                }
                else {
                    resolves.push(resolve);
                }
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    timeout = undefined;
                    const result = func(...args);
                    Promise.resolve(result).then((res) => {
                        resolves.forEach((r) => r(res));
                        resolves.length = 0;
                    });
                }, wait);
            });
        };
    },
    /**
     * onceAtATime method - Execute function only in one instance
     * @param {Function} func - Function to execute
     * @param {any} rejectOnce - Error response while function is running
     * @returns {Function} Wrapped function with onceAtATime
     */
    onceAtATime(func, rejectOnce = new Error('Function is already running')) {
        let isRunning = false;
        return async function (...args) {
            if (isRunning) {
                return Promise.reject(rejectOnce);
            }
            isRunning = true;
            try {
                return await func(...args);
            }
            finally {
                isRunning = false;
            }
        };
    },
    /**
     * Throttle method
     * - Limits the number of function calls to one per specified time interval.
     *
     * @param {Function} func - Target function to be limited.
     * @param {number} limit - Time interval in milliseconds during which the function can be called only once.
     * @returns {Function} Wrapped function with throttling.
     */
    throttle(func, limit) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                try {
                    func(...args);
                }
                catch (error) {
                    console.error('Throttled function error:', error);
                }
            }
        };
    },
};

class AQueue {
    constructor() {
        this.activeCount = 0;
        this.concurrency = 1;
    }
    _canRunProcess() {
        return this.activeCount < this.concurrency;
    }
    async _runProcess(queue) {
        const { task, resolve, reject } = queue;
        this.activeCount++;
        try {
            const result = await task();
            resolve(result);
        }
        catch (e) {
            reject(e);
        }
        finally {
            this.activeCount--;
            this._processQueue();
        }
    }
    _processQueue() {
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
    getActiveCount() {
        return this.activeCount;
    }
}

class Queue extends AQueue {
    constructor() {
        super();
        this.queues = [];
    }
    _getQueue() {
        return this.queues.shift();
    }
    add(task) {
        return new Promise((resolve, reject) => {
            this.queues.push({ task, resolve, reject });
            this._processQueue();
        });
    }
    clear() {
        this.queues.length = 0;
    }
    size() {
        return this.queues.length;
    }
}

class QueueParallel extends Queue {
    constructor(concurrency = 2) {
        super();
        this.concurrency = concurrency;
    }
}

class QueuePriority extends AQueue {
    constructor() {
        super(...arguments);
        this.queues = {
            high: [],
            normal: [],
            low: [],
        };
    }
    _getQueue() {
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
    add(task, priority = "normal") {
        return new Promise((resolve, reject) => {
            if (!(priority in this.queues)) {
                console.error(`Invalid priority: ${priority}`);
                priority = 'normal';
            }
            this.queues[priority].push({ task, resolve, reject });
            this._processQueue();
        });
    }
    clear(priority) {
        if (priority) {
            this.queues[priority].length = 0;
            return;
        }
        this.queues.high.length = 0;
        this.queues.normal.length = 0;
        this.queues.low.length = 0;
        return;
    }
    size(priority) {
        if (priority) {
            return this.queues[priority].length;
        }
        return this.queues.high.length + this.queues.normal.length + this.queues.low.length;
    }
}

var index = { mixins, Queue, QueueParallel, QueuePriority };

export { index as default };
//# sourceMappingURL=index.js.map
