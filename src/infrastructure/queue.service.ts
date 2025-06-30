import Bull from 'bull';

export class QueueService {
  private readonly queue: Bull.Queue;

  constructor() {
    this.queue = new Bull('task-queue', {
      redis: { host: 'localhost', port: 6379 },
    });
  }

  enqueue(data: any) {
    return this.queue.add(data);
  }
}