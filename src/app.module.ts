import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { JobsController } from './jobs.controller.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [],
  controllers: [AppController, JobsController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
