import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

type Job = {
  id: string;
  type: string;
  what: string;
  pickup: string;
  dropoff: string;
  when: string;
  budgetKes: number | null;
  customerClerkId?: string;
  customerEmail?: string;
  providerClerkId?: string;
  providerEmail?: string;
  status: 'posted' | 'accepted';
  createdAt: string;
};

const jobs: Job[] = [];

@Controller('jobs')
export class JobsController {
  @Post()
  create(@Body() body: Omit<Job, 'id' | 'status' | 'createdAt'>) {
    const job: Job = {
      ...body,
      id: randomUUID(),
      status: 'posted',
      createdAt: new Date().toISOString(),
    };
    jobs.unshift(job);
    return job;
  }

  @Get()
  list() {
    return jobs;
  }

  @Get(':id')
  one(@Param('id') id: string) {
    const job = jobs.find((j) => j.id === id);
    if (!job) throw new NotFoundException('Not found');
    return job;
  }

  @Patch(':id/accept')
  accept(
    @Param('id') id: string,
    @Body() body: { providerClerkId?: string; providerEmail?: string },
  ) {
    const job = jobs.find((j) => j.id === id);
    if (!job) throw new NotFoundException('Not found');
    if (job.status !== 'posted') {
      return { message: 'Job already accepted', job };
    }
    job.status = 'accepted';
    job.providerClerkId = body.providerClerkId;
    job.providerEmail = body.providerEmail;
    return job;
  }
}
