import Bull from 'bull';
// src/infrastructure/queue.service.ts

export class QueueService {
  private readonly queue: Bull.Queue;

  constructor() {
    this.queue = new Bull('task-queue', {
      redis: { host: 'localhost', port: 6379 },
    });
  }

  enqueue(
    name: string,
    payload: any,
    opts?: { attempts?: number; delay?: number; priority?: number; cron?: string },
  ) {
    return this.queue.add(name, payload, {
      attempts: opts?.attempts ?? 1,
      backoff: { type: 'fixed', delay: opts?.delay ?? 0 },
      priority: opts?.priority,
      repeat: opts?.cron ? { cron: opts.cron } : undefined,
    });
  }

  // **수동으로 대기 중인 잡 전부 처리** (모든 job.name)
  async processAllWaiting(): Promise<{ processed: number }> {
    const waiting = await this.queue.getWaiting();
    let count = 0;

    for (const job of waiting) {
      await this.handleJob(job);
      await job.remove();  
      count++;
    }

    return { processed: count };
  }

  // **특정 job.name만 처리**
  async processByName(name: string): Promise<{ processed: number }> {
    const waitingJobs = await this.queue.getWaiting();
    let count = 0;

    for (const job of waitingJobs) {
      if (job.name === name) {
        await this.handleJob(job);
        await job.moveToCompleted('done', true);
        count++;
      }
    }

    return { processed: count };
  }

  // 내부 분기 로직 (Consumer 로직)
  private async handleJob(job: Bull.Job) {
    switch (job.name) {
      case 'mail:sendWelcomeEmail':
        // MailService 호출
        console.log(`[Manual] sendWelcomeEmail →`, job.data);
        break;
      case 'analytics:heavyCompute':
        console.log(`[Manual] heavyCompute →`, job.data);
        break;
      case 'report:generateDaily':
        console.log(`[Manual] generateDaily →`, job.data);
        break;
      default:
        console.warn(`[Manual] unknown job ${job.name}`);
    }
  }
}

