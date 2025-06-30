import { Injectable } from '@nestjs/common';
import * as shortid from 'shortid';
import { User } from 'src/domain/user';
import * as r from '../application/response';
import { Infrastructure } from '../infrastructure';
import { Repository } from '../repository';
import { Utils } from '../utils';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: Repository,
    private readonly u: Utils,
    private readonly infra: Infrastructure,
  ) {}

    /** 1) 일반 환영 메일 즉시 큐잉 */
  async enqueueWelcomeEmails(): Promise<Error | { count: number; message: string }> {
    try {
      const result = await this.repo.userRepository.findAll();
       await Promise.all(
      result.map(u =>
        this.infra.queue.enqueue(
          // ① job 이름
          'mail:sendWelcomeEmail',
          // ② payload
          { userId: u.id, emailAddress: u.email },
          // ③ 옵션(재시도 3회, 1초 지연)
          { attempts: 3, delay: 1000 },
        ),
      ),
    );

    return {
      count: result.length,
      message: 'Jobs enqueued',
    };
    } catch (error) {
      throw error;
    }
  }

  /** 2) 우선순위 높은 배치 작업 예시 */
  async enqueueHeavyAnalytics(userId: string) {
    await this.infra.queue.enqueue(
      'analytics:heavyCompute',
      { userId },
      { priority: 1 }, // 1이 가장 높은 우선순위
    );
    return { message: 'Heavy analytics task queued' };
  }

  /** 3) 매일 자정 리포트 자동 스케줄링 */
  async scheduleDailyReport() {
    // cron 표현식: “0 0 * * *” → 매일 자정
    await this.infra.queue.enqueue(
      'report:generateDaily',
      { date: new Date().toISOString().slice(0, 10) },
      { cron: '0 0 * * *' },
    );
    return { message: 'Daily report job scheduled' };
  }

    /** 4) 대기 중인 모든 잡을 꺼내 처리 */
  async processAllJobs(): Promise<{ processed: number }> {
    return this.infra.queue.processAllWaiting();
  }

  /** 5) 특정 job 이름만 꺼내 처리 */
  async processJobByName(jobName: string): Promise<{ processed: number }> {
    return this.infra.queue.processByName(jobName);
  }


  async SignUp(req: User.UserDTO): Promise<Error | true> {
    try {
      req.refresh_token = this.u.jwt.CreateRefreshToken(req.id);
      req.id = shortid.generate();
      req.birth = new Date(req.birth);
      req.app_key = this.u.bcrypt.encrypt(req.app_key);
      return await this.repo.userRepository.CreateUser(req);
    } catch (error) {
      throw error;
    }
  }

  async SignIn(req: User.UserDTO): Promise<Error | User.Token> {
    try {
      const rows = await this.repo.userRepository.findOne(req);
      if (!rows) throw r.TypeError(1);
      const CheckAppkey = this.u.bcrypt.compare(req.app_key, rows.app_key);
      if (!CheckAppkey) throw r.TypeError(2);
      const token = r.Token(
        this.u.jwt.CreateAccessToken(rows.id),
        this.u.jwt.CreateRefreshToken(rows.id),
      );
      await this.repo.userRepository.UpdateRToken(token.refreshToken, rows.id);
      return token;
    } catch (error) {
      throw error;
    }
  }
}
