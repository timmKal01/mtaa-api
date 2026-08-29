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

type JobStatus = 'posted' | 'accepted' | 'picked_up' | 'delivered';

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
  status: JobStatus;
  createdAt: string;
};

const jobs: Job[] = [];

function getJob(id: string) {
  const job = jobs.find((j) => j.id === id);
  if (!job) throw new NotFoundException('Not found');
  return job;
}

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
    return getJob(id);
  }

  @Patch(':id/accept')
  accept(
    @Param('id') id: string,
    @Body() body: { providerClerkId?: string; providerEmail?: string },
  ) {
    const job = getJob(id);
    if (job.status !== 'posted') {
      return { message: 'Job cannot be accepted', job };
    }
    job.status = 'accepted';
    job.providerClerkId = body.providerClerkId;
    job.providerEmail = body.providerEmail;
    return job;
  }

  @Patch(':id/pickup')
  pickup(@Param('id') id: string) {
    const job = getJob(id);
    if (job.status !== 'accepted') {
      return { message: 'Job cannot be picked up', job };
    }
    job.status = 'picked_up';
    return job;
  }

  @Patch(':id/deliver')
  deliver(@Param('id') id: string) {
    const job = getJob(id);
    if (job.status !== 'picked_up') {
      return { message: 'Job cannot be delivered', job };
    }
    job.status = 'delivered';
    return job;
  }
}
