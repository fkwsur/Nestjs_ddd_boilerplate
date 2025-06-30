import Bull from 'bull';

export class QueueService {
  private readonly queue: Bull.Queue;

  constructor() {
    this.queue = new Bull('task-queue', {
      redis: { host: 'localhost', port: 6379 },
    });

    // 공통 핸들러 함수
    const handler = async (job: Bull.Job) => {
      console.log(`[Worker] processing #${job.id} (${job.name})`);
      try {
        switch (job.name) {
          case 'mail:sendWelcomeEmail':
            await this.handleSendWelcomeEmail(job.data);
            break;
          case 'analytics:heavyCompute':
            await this.handleHeavyCompute(job.data);
            break;
          case 'report:generateDaily':
            await this.handleGenerateDailyReport(job.data);
            break;
          default:
            console.warn(`[Worker] no handler for "${job.name}"`);
        }
      } catch (err) {
        console.error(`[Worker] error in handler for "${job.name}"`, err);
        throw err;
      }
    };

    // 처리할 모든 잡 이름 리스트
    const jobNames = [
      '__default__',              // enqueue(name omitted) 용
      'mail:sendWelcomeEmail',
      'analytics:heavyCompute',
      'report:generateDaily',
    ];

    // 각 이름마다 process(name, handler) 등록
    for (const name of jobNames) {
      this.queue.process(name, handler);
    }

    // 완료·실패 이벤트 로깅
    this.queue.on('completed', job =>
      console.log(`[Worker] #${job.id} (${job.name}) completed`)
    );
    this.queue.on('failed', (job, err) =>
      console.error(`[Worker] #${job.id} (${job.name}) failed:`, err)
    );
  }

  /** 작업 등록 */
  enqueue(
    name: string,
    payload: any,
    opts?: {
      attempts?: number;
      delay?: number;
      priority?: number;
      cron?: string;
    },
  ) {
    return this.queue.add(name, payload, {
      attempts: opts?.attempts ?? 1,
      backoff: { type: 'fixed', delay: opts?.delay ?? 0 },
      priority: opts?.priority,
      repeat: opts?.cron ? { cron: opts.cron } : undefined,
    });
  }

  // === Job 핸들러 메서드들 ===
  private async handleSendWelcomeEmail(data: any) {
    console.log(`→ Sending welcome email to ${data.emailAddress}`);
    // await emailClient.sendWelcome(data.emailAddress, data.userId);
  }
  private async handleHeavyCompute(data: any) {
    console.log(`→ Heavy compute for user ${data.userId}`);
    // await analyticsService.compute(data.userId);
  }
  private async handleGenerateDailyReport(data: any) {
    console.log(`→ Generating daily report for ${data.date}`);
    // await reportService.generateDaily(data.date);
  }
}
