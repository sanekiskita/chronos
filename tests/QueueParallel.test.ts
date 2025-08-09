import QueueParallel from '../src/queue/QueueParallel';

describe('QueueParallel', () => {
  let queue: QueueParallel;

  beforeEach(() => {
    queue = new QueueParallel(2);
  });

  test('should run tasks in parallel up to concurrency limit', async () => {
    const fn = jest.fn((x: number) => Promise.resolve(x * 2));

    const p1 = queue.add(() => fn(1));
    const p2 = queue.add(() => fn(2));
    const p3 = queue.add(() => fn(3));

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);

    expect(fn).toHaveBeenCalledTimes(3);
    expect([r1, r2, r3]).toEqual([2, 4, 6]);
  });

  test('should process all tasks', async () => {
    const results: string[] = [];

    const createTask = (id: string) => () => {
      results.push(id);
      return Promise.resolve(id);
    };

    const promises = [
      queue.add(createTask('a')),
      queue.add(createTask('b')),
      queue.add(createTask('c')),
      queue.add(createTask('d')),
    ];

    await Promise.all(promises);

    expect(results).toHaveLength(4);
    expect(results).toContain('a');
    expect(results).toContain('b');
    expect(results).toContain('c');
    expect(results).toContain('d');
  });

  test('should respect concurrency limit', async () => {
    let running = 0;
    let maxConcurrent = 0;

    const createTask = (id: number) => () => {
      return new Promise((resolve) => {
        running++;
        maxConcurrent = Math.max(maxConcurrent, running);
        
        setTimeout(() => {
          running--;
          resolve(id);
        }, 50);
      });
    };

    const promises = [
      queue.add(createTask(1)),
      queue.add(createTask(2)),
      queue.add(createTask(3)),
      queue.add(createTask(4)),
    ];

    // Wait a bit for tasks to start
    await new Promise(resolve => setTimeout(resolve, 25));
    expect(maxConcurrent).toBeLessThanOrEqual(2);

    // Wait for all tasks to complete
    await Promise.all(promises);
  });
});
