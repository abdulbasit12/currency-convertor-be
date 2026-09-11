import 'reflect-metadata';

import type { Request, Response } from 'express';
import type { INestApplication } from '@nestjs/common';

declare const require: NodeRequire;

let appPromise: Promise<INestApplication> | undefined;

async function createNestApp() {
  const { ValidationPipe } = require('@nestjs/common') as typeof import('@nestjs/common');
  const { NestFactory } = require('@nestjs/core') as typeof import('@nestjs/core');
  const { AppModule } = require('../src/app.module') as typeof import('../src/app.module');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

export default async function handler(request: Request, response: Response) {
  if (request.path === '/' || request.url === '/') {
    return response.status(200).json({ status: 'ok' });
  }

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