import QueuePriority from '../src/queue/QueuePriority';
import { IPriority } from '../src/interface/IQueue';

describe('QueuePriority', () => {
  let queue: QueuePriority;

  beforeEach(() => {
    queue = new QueuePriority();
  });

  test('executes tasks by priority: high > normal > low', async () => {
    const results: number[] = [];

    const addTask = (id: number, priority: IPriority) => {
      return queue.add(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            results.push(id);
            resolve(id);
          }, 10);
        });
      }, priority);
    };

    // Add tasks in mixed order - they will all be queued first
    const promises = [
      addTask(1, 'low'),      // Will be processed last
      addTask(2, 'low'),      // Will be processed last  
      addTask(3, 'high'),     // Will be processed first
      addTask(4, 'normal'),   // Will be processed middle
      addTask(5, 'high'),     // Will be processed first
    ];

    await Promise.all(promises);

    // With setTimeout(0), all tasks are queued first, then processed by priority
    // Expected order: highs first (3,5), then normal (4), then lows (1,2)
    expect(results).toEqual([3, 5, 4, 1, 2]);
  });

  test('add with invalid priority uses normal and outputs error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await queue.add(() => 42, 'urgent' as any);

    expect(result).toBe(42);
    expect(spy).toHaveBeenCalledWith('Invalid priority: urgent');

    spy.mockRestore();
  });

  test('clear(priority) clears only specified priority', () => {
    // Use longer tasks
    const longTask = () => new Promise(resolve => setTimeout(resolve, 1000));
    
    queue.add(longTask, 'high');
    queue.add(longTask, 'low');
    queue.add(longTask, 'normal');

    // All tasks are in queue since setTimeout(0) delays processing
    expect(queue.size()).toBe(3);

    queue.clear('low');
    expect(queue.size()).toBe(2);
    expect(queue.size('low')).toBe(0);
  });

  test('clear() clears all priorities', () => {
    const longTask = () => new Promise(resolve => setTimeout(resolve, 1000));
    
    queue.add(longTask, 'high');
    queue.add(longTask, 'normal');
    queue.add(longTask, 'low');

    // All tasks are in queue since setTimeout(0) delays processing
    expect(queue.size()).toBe(3);
    queue.clear();
    expect(queue.size()).toBe(0);
  });

  test('size(priority) returns number of tasks in specific priority', () => {
    const longTask = () => new Promise(resolve => setTimeout(resolve, 1000));
    
    queue.add(longTask, 'high');
    queue.add(longTask, 'normal');
    queue.add(longTask, 'normal');

    // All tasks are in queue since setTimeout(0) delays processing
    expect(queue.size('high')).toBe(1);
    expect(queue.size('normal')).toBe(2);
    expect(queue.size('low')).toBe(0);
    expect(queue.size()).toBe(3);
  });
});
