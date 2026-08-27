import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  status: 'posted';
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
    return jobs.find((j) => j.id === id) ?? { message: 'Not found' };
  }
}
