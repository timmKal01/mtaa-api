import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { JobsController } from './jobs.controller.js';

@Module({
  imports: [],
  controllers: [AppController, JobsController],
  providers: [AppService],
})
export class AppModule {}
