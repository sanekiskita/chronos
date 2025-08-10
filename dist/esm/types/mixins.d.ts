import type { AnyFunc } from './interface/IFunction';
declare const mixins: {
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
    debounce(func: AnyFunc, wait: number, onlyOne?: boolean): (...args: Parameters<AnyFunc>) => Promise<ReturnType<AnyFunc>>;
    /**
     * onceAtATime method - Execute function only in one instance
     * @param {Function} func - Function to execute
     * @param {any} rejectOnce - Error response while function is running
     * @returns {Function} Wrapped function with onceAtATime
     */
    onceAtATime(func: AnyFunc, rejectOnce?: any): (...args: Parameters<AnyFunc>) => Promise<ReturnType<AnyFunc>>;
    /**
     * Throttle method
     * - Limits the number of function calls to one per specified time interval.
     *
     * @param {Function} func - Target function to be limited.
     * @param {number} limit - Time interval in milliseconds during which the function can be called only once.
     * @returns {Function} Wrapped function with throttling.
     */
    throttle(func: AnyFunc, limit: number): (...args: Parameters<AnyFunc>) => void;
};
export default mixins;
