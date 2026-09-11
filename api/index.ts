import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { AppModule, ObserveInstrument } from '../src/app.module';

let appPromise: ReturnType<typeof createNestApp> | undefined;

async function createNestApp() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

export default async function handler(request: Request, response: Response) {
  appPromise ??= createNestApp();

  const app = await appPromise;
  return app.getHttpAdapter().getInstance()(request, response);
}