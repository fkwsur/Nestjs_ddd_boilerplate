import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Controller } from './application';
import { Infrastructure } from "./infrastructure";
import { Repository } from './repository';
import { Service } from './service';
import { Utils } from './utils';

@Module({
  imports: [
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
  ],
  controllers: Controller,
  providers: [Service,Infrastructure,Repository,Utils],
  exports: [
    Repository,
    Infrastructure,
    Service,
    Utils
  ]
})
export class AppModule {}
