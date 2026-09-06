import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import type { ClerkClient } from '@clerk/backend';
import { PrismaService } from './prisma.service.js';
import { CLERK_CLIENT } from './auth/clerk-client.provider.js';
import { ClerkAuthGuard } from './auth/clerk-auth.guard.js';
import { CurrentUserId } from './auth/current-user-id.decorator.js';
import { CreateJobDto } from './create-job.dto.js';

@Controller('jobs')
@UseGuards(ClerkAuthGuard)
export class JobsController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLERK_CLIENT) private readonly clerkClient: ClerkClient,
  ) {}

  private async emailFor(userId: string): Promise<string | undefined> {
    try {
      const user = await this.clerkClient.users.getUser(userId);
      return (
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress
      );
    } catch {
      return undefined;
    }
  }

  @Post()
  async create(@CurrentUserId() userId: string, @Body() body: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        type: body.type,
        what: body.what,
        pickup: body.pickup,
        dropoff: body.dropoff,
        when: body.when,
        budgetKes: body.budgetKes ?? null,
        customerClerkId: userId,
        customerEmail: await this.emailFor(userId),
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
  async accept(@Param('id') id: string, @CurrentUserId() userId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    if (job.status !== JobStatus.posted) {
      return { message: 'Job cannot be accepted', job };
    }
    if (userId === job.customerClerkId) {
      return { message: 'You cannot accept your own job', job };
    }
    if (job.paymentStatus !== 'paid') {
      return { message: 'Job is not paid yet', job };
    }
    return this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.accepted,
        providerClerkId: userId,
        providerEmail: await this.emailFor(userId),
      },
    });
  }

  @Patch(':id/pickup')
  async pickup(@Param('id') id: string, @CurrentUserId() userId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    if (job.providerClerkId !== userId) {
      return { message: 'Only the assigned provider can update this job', job };
    }
    if (job.status !== JobStatus.accepted) {
      return { message: 'Job cannot be picked up', job };
    }
    return this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.picked_up },
    });
  }

  @Patch(':id/deliver')
  async deliver(@Param('id') id: string, @CurrentUserId() userId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    if (job.providerClerkId !== userId) {
      return { message: 'Only the assigned provider can update this job', job };
    }
    if (job.status !== JobStatus.picked_up) {
      return { message: 'Job cannot be delivered', job };
    }
    return this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.delivered },
    });
  }

  @Patch(':id/pay')
  async pay(@Param('id') id: string, @CurrentUserId() userId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Not found');
    if (userId !== job.customerClerkId) {
      return { message: 'Only the customer can pay', job };
    }
    if (job.paymentStatus === 'paid') {
      return { message: 'Already paid', job };
    }
    return this.prisma.job.update({
      where: { id },
      data: {
        paymentStatus: 'paid',
        mpesaReceipt: `STUB-${Date.now()}`,
      },
    });
  }
}
