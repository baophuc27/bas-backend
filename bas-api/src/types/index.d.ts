import { Response } from 'express';

declare module 'express-serve-static-core' {
  interface Response {
    error: (code: number, message: string) => Response;
    success: (data: any, message?: string) => Response;
  }
}

