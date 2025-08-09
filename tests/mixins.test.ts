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
  });
});