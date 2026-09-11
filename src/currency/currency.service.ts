import {
    BadGatewayException,
    BadRequestException,
    Injectable,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConvertCurrencyDto } from './dto/convert-currency.dto.js';
import { Conversion, ConversionDocument } from './schemas/conversion.schema.js';

interface RatesResponse {
    data?: Record<string, number>;
}

@Injectable()
export class CurrencyService {
    private readonly apiUrl = 'https://api.freecurrencyapi.com/v1';

    constructor(
        private readonly configService: ConfigService,
        @InjectModel(Conversion.name)
        private readonly conversionModel: Model<ConversionDocument>,
    ) { }

    async getCurrencies() {
        const response = await this.request('/currencies');
        return response.data ?? {};
    }

    async convert(dto: ConvertCurrencyDto) {
        const from = dto.from.toUpperCase();
        const to = dto.to.toUpperCase();
        const userId = dto.userId.trim();

        if (!userId) {
            throw new BadRequestException('userId is required');
        }

        const rates = await this.request(`/latest?base_currency=${encodeURIComponent(from)}&currencies=${encodeURIComponent(to)}`) as RatesResponse;
        const rate = rates.data?.[to];

        if (typeof rate !== 'number') {
            throw new BadGatewayException('The currency API did not return a conversion rate');
        }

        const result = dto.amount * rate;
        const conversion = await this.conversionModel.create({
            userId,
            from,
            to,
            amount: dto.amount,
            rate,
            result,
        });

        return {
            id: conversion.id,
            userId,
            from,
            to,
            amount: dto.amount,
            rate,
            result,
            convertedAt: conversion.createdAt,
        };
    }

    getHistory(userId: string) {
        const normalizedUserId = userId?.trim();
        if (!normalizedUserId) {
            throw new BadRequestException('userId is required');
        }

        return this.conversionModel
            .find({ userId: normalizedUserId })
            .sort({ createdAt: -1 })
            .lean();
    }

    private async request(path: string): Promise<Record<string, unknown>> {
        const apiKey = this.configService.get<string>('API_KEY');
        if (!apiKey) {
            throw new ServiceUnavailableException('API_KEY is not configured');
        }

        let response: Response;
        try {
            response = await fetch(`${this.apiUrl}${path}`, {
                headers: { apikey: apiKey },
            });
        } catch {
            throw new ServiceUnavailableException('Currency API is unavailable');
        }

        const body = await response.json() as Record<string, unknown>;
        if (!response.ok) {
            throw new BadGatewayException(
                typeof body.message === 'string' ? body.message : 'Currency API request failed',
            );
        }

        return body;
    }
}
