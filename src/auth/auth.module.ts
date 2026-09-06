import { Module } from '@nestjs/common';
import { clerkClientProvider } from './clerk-client.provider.js';
import { ClerkAuthGuard } from './clerk-auth.guard.js';

@Module({
  providers: [clerkClientProvider, ClerkAuthGuard],
  exports: [clerkClientProvider, ClerkAuthGuard],
})
export class AuthModule {}
