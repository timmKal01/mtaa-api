import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { PrismaService } from './prisma.service.js';

@Controller('jobs')
export class JobsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  create(
    @Body()
    body: {
      type: string;
      what: string;
      pickup: string;
      dropoff: string;
      when: string;
      budgetKes?: number | null;
      customerClerkId?: string;
      customerEmail?: string;
    },
  ) {
    return this.prisma.job.create({
      data: {
        type: body.type,
        what: body.what,
        pickup: body.pickup,
        dropoff: body.dropoff,
        when: body.when,
        budgetKes: body.budgetKes ?? null,
        customerClerkId: body.customerClerkId,
        customerEmail: body.customerEmail,
      },
    });
  }

  @Get()
  list() {
    return this.prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Get(':id')
  async one(@Param('id') id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    return job;
  }

  @Patch(':id/accept')
  async accept(
    @Param('id') id: string,
    @Body() body: { providerClerkId?: string; providerEmail?: string },
  ) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    if (job.status !== JobStatus.posted) {
      return { message: 'Job cannot be accepted', job };
    }
    if (body.providerClerkId && body.providerClerkId === job.customerClerkId) {
      return { message: 'You cannot accept your own job', job };
    }
    return this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.accepted,
        providerClerkId: body.providerClerkId,
        providerEmail: body.providerEmail,
      },
    });
  }

  @Patch(':id/pickup')
  async pickup(@Param('id') id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    if (job.status !== JobStatus.accepted) {
      return { message: 'Job cannot be picked up', job };
    }
    return this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.picked_up },
    });
  }

  @Patch(':id/deliver')
  async deliver(@Param('id') id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    if (job.status !== JobStatus.picked_up) {
      return { message: 'Job cannot be delivered', job };
    }
    return this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.delivered },
    });
  }
}