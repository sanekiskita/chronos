import type { AnyFunc } from './interface/IFunction';

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
  debounce (
    func: AnyFunc,
    wait: number,
    onlyOne: boolean = true
  ): (...args: Parameters<AnyFunc>) => Promise<ReturnType<AnyFunc>> {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    const resolves: ((value: ReturnType<AnyFunc>) => void)[] = [];

    return function (...args: Parameters<AnyFunc>): Promise<ReturnType<AnyFunc>> {

      return new Promise((resolve): void => {
        if (onlyOne) {
          resolves[0] = resolve;
        } else {
          resolves.push(resolve);
        }

        clearTimeout(timeout);
        timeout = setTimeout(
          () => {
            timeout = undefined;
            const result = func(...args);
            Promise.resolve(result).then((res) => {
              resolves.forEach((r) => r(res));
              resolves.length = 0;
            });
          },
          wait
        );
      });
    };
  },

  /**
   * onceAtATime method - Execute function only in one instance
   * @param {Function} func - Function to execute
   * @param {any} rejectOnce - Error response while function is running
   * @returns {Function} Wrapped function with onceAtATime
   */
  onceAtATime (
    func: AnyFunc,
    rejectOnce: any = new Error('Function is already running')
  ): (...args: Parameters<AnyFunc>) => Promise<ReturnType<AnyFunc>> {
    let isRunning = false;
  
    return async function (...args: Parameters<AnyFunc>): Promise<ReturnType<AnyFunc>> {
      if (isRunning) {
        return Promise.reject(rejectOnce);
      }

      isRunning = true;
      try {
        return await func(...args);
      } finally {
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
  throttle (
    func: AnyFunc,
    limit: number
  ): (...args: Parameters<AnyFunc>) => void {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        try {
          func(...args);
        } catch (error) {
          console.error('Throttled function error:', error);
        }
      }
    };
  },
};

export default mixins;