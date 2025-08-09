import mixins from './mixins';

// Queue
import QueueParallel from './queue/QueueParallel';
import QueuePriority from './queue/QueuePriority';
import Queue from './queue/Queue';

export default { mixins, Queue, QueueParallel, QueuePriority };