import mixins from '../src/mixins';

describe('mixins', () => {
  describe('debounce', () => {
    it('should call function once after delay (search)', async () => {
      jest.useFakeTimers();
      const mockFn = jest.fn((value) => value);
      const debounced = mixins.debounce(mockFn, 100);

      debounced('a');
      jest.advanceTimersByTime(20);
      debounced('a');
      jest.advanceTimersByTime(40);
      const promise3 = debounced('c');

      jest.advanceTimersByTime(100);
      const result = await promise3;

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toBe('c');

      jest.useRealTimers();
    });

    it('should return result to all calls if onlyOne = false (get Api)', async () => {
      jest.useFakeTimers();
      const mockFn = jest.fn((value) => value);
      const debounced = mixins.debounce(mockFn, 100, false);

      const promise1 = debounced('x');
      const promise2 = debounced('y');

      jest.advanceTimersByTime(100);
      const [res1, res2] = await Promise.all([promise1, promise2]);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(res1).toBe('y');
      expect(res2).toBe('y');

      jest.useRealTimers();
    });
  });

  describe('onceAtATime', () => {
    it('should allow one call at a time', async () => {
      const mockFn = jest.fn().mockImplementation(() => new Promise(res => setTimeout(() => res('done'), 100)));
      const wrapped = mixins.onceAtATime(mockFn);

      const first = wrapped('1');
      const second = wrapped('2').catch(e => e);

      const result1 = await first;
      const result2 = await second;

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result1).toBe('done');
      expect(result2).toEqual(new Error('Function is already running'));
    });

    it('should use custom rejection value', async () => {
      const mockFn = jest.fn().mockImplementation(() => new Promise(res => setTimeout(() => res('done'), 50)));
      const customError = 'Custom busy message';
      const wrapped = mixins.onceAtATime(mockFn, customError);

      const first = wrapped();
      const second = wrapped().catch(e => e);

      const result1 = await first;
      const result2 = await second;

      expect(result1).toBe('done');
      expect(result2).toBe(customError);
    });
  });

  describe('throttle', () => {
    it('should call function no more than once per interval', () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const throttled = mixins.throttle(mockFn, 100);

      throttled('a');
      throttled('b');
      jest.advanceTimersByTime(100);
      throttled('c');

      expect(mockFn).toHaveBeenCalledTimes(2);

      jest.useRealTimers();
    });

    it('should handle function errors gracefully', () => {
      const mockFn = jest.fn(() => { throw new Error('Test error'); });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const throttled = mixins.throttle(mockFn, 100);

      // Should not throw error, just log it
      expect(() => throttled('test')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Throttled function error:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should pass arguments correctly', () => {
      jest.useFakeTimers();
      const mockFn = jest.fn();
      const throttled = mixins.throttle(mockFn, 100);

      throttled('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

      jest.useRealTimers();
    });
  });
});