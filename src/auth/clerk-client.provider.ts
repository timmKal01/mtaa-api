import { createClerkClient, type ClerkClient } from '@clerk/backend';
import type { Provider } from '@nestjs/common';

export const CLERK_CLIENT = Symbol('CLERK_CLIENT');

export const clerkClientProvider: Provider = {
  provide: CLERK_CLIENT,
  useFactory: (): ClerkClient => {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY is not set');
    }
    return createClerkClient({ secretKey });
  },
};
