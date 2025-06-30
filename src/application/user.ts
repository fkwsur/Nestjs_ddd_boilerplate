import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/domain/user';
import { Service } from '../service';
import * as r from './response';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly svc: Service) {}

  // 1) 전체 사용자에게 환영 메일 큐잉
  @Get('queue/welcome')
  enqueueWelcome() {
    return this.svc.userService.enqueueWelcomeEmails();
  }

  // 2) 특정 사용자에 대한 우선순위 작업
  @Get('queue/analytics/:id')
  enqueueAnalytics(@Param('id') id: string) {
    return this.svc.userService.enqueueHeavyAnalytics(id);
  }

  // 3) 리포트 스케줄링 (단발성 스케줄링도 가능)
  @Get('queue/schedule-report')
  scheduleReport() {
    return this.svc.userService.scheduleDailyReport();
  }

  // 4) 대기 중인 모든 잡 처리 (소비자 API)
  @Get('queue/process-all')
  processAll() {
    return this.svc.userService.processAllJobs();
  }

  // 5) 특정 잡 이름만 처리 (소비자 API)
  @Get('queue/process/:jobName')
  processJob(@Param('jobName') jobName: string) {
    return this.svc.userService.processJobByName(jobName);
  }

  @Post('/signup')
  async SignUp(@Body() req: User.UserDTO): Promise<any> {
    try {
      await this.svc.userService.SignUp(req);
      return r.Result(0);
    } catch (error) {
      return r.Error(error);
    }
  }

  @Post('/signin')
  async SignIn(@Body() req: User.UserDTO): Promise<any> {
    try {
      return await this.svc.userService.SignIn(req);
    } catch (error) {
      return r.Error(error);
    }
  }
}
