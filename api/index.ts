import 'reflect-metadata';

import type { Request, Response } from 'express';
import type { INestApplication } from '@nestjs/common';

let appPromise: Promise<INestApplication> | undefined;

async function getCurrencies(request: Request, response: Response) {
  setCorsHeaders(response);
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return response.status(503).json({ message: 'API_KEY is not configured' });
  }

  try {
    const currenciesResponse = await fetch(
      'https://api.freecurrencyapi.com/v1/currencies',
      { headers: { apikey: apiKey } },
    );
    const body = await currenciesResponse.json();
    return response.status(currenciesResponse.status).json(body);
  } catch (error) {
    console.error('Failed to fetch currencies', error);
    return response.status(502).json({ message: 'Currency API is unavailable' });
  }
}

function setCorsHeaders(response: Response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getRequestPath(request: Request) {
  const rawPath = request.originalUrl ?? request.url ?? request.path;
  const pathname = new URL(rawPath, 'http://localhost').pathname;
  return pathname.replace(/^\/api(?=\/|$)/, '') || '/';
}

function removeApiPrefix(request: Request) {
  const normalizedUrl = request.url.replace(/^\/api(?=\/|$)/, '') || '/';
  request.url = normalizedUrl;
  request.originalUrl = normalizedUrl;
  request.baseUrl = '';
}

async function createNestApp() {
  const [{ ValidationPipe }, { NestFactory }, { AppModule }] = await Promise.all([
    import('@nestjs/common'),
    import('@nestjs/core'),
    import('../src/app.module.js'),
  ]);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

export default async function handler(request: Request, response: Response) {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  const requestPath = getRequestPath(request);

  if (requestPath === '/') {
    return response.status(200).json({ status: 'ok' });
  }

  if (requestPath === '/currency/currencies') {
    return getCurrencies(request, response);
  }

  try {
    removeApiPrefix(request);
    appPromise ??= createNestApp();
    const app = await appPromise;
    return app.getHttpAdapter().getInstance()(request, response);
  } catch (error) {
    appPromise = undefined;
    console.error('Failed to initialize NestJS serverless application', error);
    const message = error instanceof Error ? error.message : 'Unknown initialization error';
    return response.status(503).json({ message: 'Application initialization failed', error: message });
  }
}