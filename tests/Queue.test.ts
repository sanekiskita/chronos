import Queue from '../src/queue/Queue';

describe('Queue', () => {
  let queue: Queue;

  beforeEach(() => {
    queue = new Queue();
  });

  test('adds a task to the queue and processes it', async () => {
    const mockFn = jest.fn(() => 'result');

    const promise = queue.add(mockFn);
    const result = await promise;

    expect(mockFn).toHaveBeenCalled();
    expect(result).toBe('result');
    expect(queue.size()).toBe(0);
  });

  test('handles async task', async () => {
    const mockFn = jest.fn(() => Promise.resolve('async result'));

    const promise = queue.add(mockFn);
    const result = await promise;

    expect(mockFn).toHaveBeenCalled();
    expect(result).toBe('async result');
  });

  test('handles task errors', async () => {
    const error = new Error('Task failed');
    const mockFn = jest.fn(() => { throw error; });

    const promise = queue.add(mockFn);
    
    await expect(promise).rejects.toThrow('Task failed');
    expect(queue.size()).toBe(0);
  });

  test('handles async task errors', async () => {
    const error = new Error('Async task failed');
    const mockFn = jest.fn(() => Promise.reject(error));

    const promise = queue.add(mockFn);
    
    await expect(promise).rejects.toThrow('Async task failed');
    expect(queue.size()).toBe(0);
  });

  test('continues processing after task error', async () => {
    const error = new Error('First task failed');
    const mockFn1 = jest.fn(() => { throw error; });
    const mockFn2 = jest.fn(() => 'success');

    const promise1 = queue.add(mockFn1);
    const promise2 = queue.add(mockFn2);
    
    await expect(promise1).rejects.toThrow('First task failed');
    const result2 = await promise2;
    
    expect(result2).toBe('success');
    expect(queue.size()).toBe(0);
  });

  test('clear() removes all tasks', () => {
    const longTask = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));

    queue.add(longTask);
    queue.add(longTask);
    
    // Both tasks are in queue initially (before setTimeout(0) executes)
    expect(queue.size()).toBe(2);

    queue.clear();
    expect(queue.size()).toBe(0);
  });

  test('size() returns correct queue length', () => {
    expect(queue.size()).toBe(0);

    const longTask = () => new Promise(resolve => setTimeout(resolve, 100));
    
    queue.add(longTask);
    expect(queue.size()).toBe(1);
    
    queue.add(longTask);
    expect(queue.size()).toBe(2); // Both tasks are in queue initially
  });

  test('multiple tasks run sequentially', async () => {
    const results: string[] = [];

    const task1 = jest.fn(() => {
      results.push('task1');
      return 'done1';
    });

    const task2 = jest.fn(() => {
      results.push('task2');
      return 'done2';
    });

    const p1 = queue.add(task1);
    const p2 = queue.add(task2);

    const res1 = await p1;
    const res2 = await p2;

    expect(res1).toBe('done1');
    expect(res2).toBe('done2');
    expect(results).toEqual(['task1', 'task2']);
  });

  test('getActiveCount returns correct number of running tasks', async () => {
    expect(queue.getActiveCount()).toBe(0);

    const longTask = () => new Promise(resolve => setTimeout(resolve, 100));
    
    queue.add(longTask);
    queue.add(longTask);
    
    // Wait for setTimeout(0) to start first task
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(queue.getActiveCount()).toBe(1);
  });
});
