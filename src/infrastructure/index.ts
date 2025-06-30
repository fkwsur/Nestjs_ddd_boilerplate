import { Injectable } from '@nestjs/common';
import { MysqlConnector } from './mysql_orm';
import { QueueService } from './queue.service';

@Injectable()
export class Infrastructure {
  public mysql: MysqlConnector;
  public queue: QueueService;
  constructor() {
    this.mysql = new MysqlConnector();
    this.queue = new QueueService();
  }
}
