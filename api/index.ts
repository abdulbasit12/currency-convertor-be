import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { AppModule } from '../src/app.module';

let appPromise: ReturnType<typeof createNestApp> | undefined;

async function createNestApp() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

export default async function handler(request: Request, response: Response) {
  try {
    appPromise ??= createNestApp();
    const app = await appPromise;
    return app.getHttpAdapter().getInstance()(request, response);
  } catch (error) {
    appPromise = undefined;
    console.error('Failed to initialize NestJS serverless application', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}