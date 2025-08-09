# Boom/@chronos

A TypeScript library providing utility mixins and queue implementations for asynchronous task management.

## Features

### Mixins
- **debounce** - Delays function execution until a specified time has passed since the last call
- **onceAtATime** - Ensures only one instance of a function runs at a time
- **throttle** - Limits function calls to once per specified time interval

### Queue Systems
- **Queue** - Basic FIFO queue with sequential task execution
- **QueueParallel** - Parallel queue with configurable concurrency
- **QueuePriority** - Priority-based queue with high/normal/low priorities

## Installation

```bash
npm install boom/@chronos
```

## Usage

### Mixins

#### Debounce
Delays function execution until `wait` milliseconds have passed since the last call:

```typescript
import { mixins } from 'boom/@chronos';

const debouncedSearch = mixins.debounce(
  (query: string) => fetch(`/api/search?q=${query}`),
  300 // 300ms delay
);

// Only the last call will execute after 300ms
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // Only this will execute
```

With `onlyOne = false`, all pending calls receive the same result:

```typescript
const debouncedApi = mixins.debounce(
  (id: string) => fetch(`/api/data/${id}`),
  100,
  false // All calls get the result
);
```

#### OnceAtATime
Ensures only one instance of a function runs at a time:

```typescript
const protectedFunction = mixins.onceAtATime(
  async () => {
    // Expensive operation
    return await processLargeFile();
  }
);

// First call executes, second call rejects
protectedFunction().then(result => console.log(result));
protectedFunction().catch(err => console.log(err)); // "Function is already running"
```

#### Throttle
Limits function calls to once per time interval:

```typescript
const throttledHandler = mixins.throttle(
  (event: Event) => {
    console.log('Scroll event handled');
  },
  100 // Maximum once per 100ms
);

window.addEventListener('scroll', throttledHandler);
```

### Queues

#### Basic Queue
Sequential task execution:

```typescript
import { Queue } from 'boom/@chronos';

const queue = new Queue();

queue.add(() => fetch('/api/task1'));
queue.add(() => fetch('/api/task2'));
queue.add(() => fetch('/api/task3'));

// Tasks execute one after another
```

#### Parallel Queue
Concurrent task execution with configurable limits:

```typescript
import { QueueParallel } from 'boom/@chronos';

const parallelQueue = new QueueParallel(3); // Max 3 concurrent tasks

parallelQueue.add(() => fetch('/api/task1'));
parallelQueue.add(() => fetch('/api/task2'));
parallelQueue.add(() => fetch('/api/task3'));
parallelQueue.add(() => fetch('/api/task4'));

// First 3 tasks run immediately, 4th waits for a slot
```

#### Priority Queue
Task execution based on priority levels:

```typescript
import { QueuePriority } from 'boom/@chronos';

const priorityQueue = new QueuePriority();

priorityQueue.add(() => fetch('/api/low-priority'), 'low');
priorityQueue.add(() => fetch('/api/high-priority'), 'high');
priorityQueue.add(() => fetch('/api/normal-priority'), 'normal');
priorityQueue.add(() => fetch('/api/another-high'), 'high');

// Execution order: high, high, normal, low
```

## API Reference

### Mixins

#### `debounce(func, wait, onlyOne?)`
- `func`: Function to debounce
- `wait`: Delay in milliseconds
- `onlyOne`: If true (default), only the last caller gets the result

#### `onceAtATime(func, rejectOnce?)`
- `func`: Function to protect
- `rejectOnce`: Error to return for concurrent calls

#### `throttle(func, limit)`
- `func`: Function to throttle
- `limit`: Minimum interval between calls in milliseconds

### Queue Methods

#### Common Methods
- `add(task)`: Add task to queue, returns Promise
- `clear()`: Remove all pending tasks
- `size()`: Get number of pending tasks
- `getActiveCount()`: Get number of currently running tasks

#### QueueParallel Constructor
- `new QueueParallel(concurrency)`: Set maximum concurrent tasks (default: 2)

#### QueuePriority Methods
- `add(task, priority?)`: Add task with priority ('high' | 'normal' | 'low')
- `clear(priority?)`: Clear all tasks or specific priority
- `size(priority?)`: Get total size or size of specific priority

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Development mode
npm run dev
```

## Testing

The project includes comprehensive test coverage for all mixins and queue implementations. Tests use Jest with fake timers for precise timing control.

```bash
npm test
```

## License

ISC

## Author

sanekiskita 