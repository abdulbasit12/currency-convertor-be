import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConvertCurrencyDto } from './dto/convert-currency.dto.js';
import { CurrencyService } from './currency.service.js';
import { HistoricalRatesDto } from './dto/historical-rates.dto.js';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('currencies')
  getCurrencies() {
    return this.currencyService.getCurrencies();
  }

  @Get('historical')
  getHistorical(@Query() query: HistoricalRatesDto) {
    return this.currencyService.getHistorical(query);
  }

  @Post('convert')
  convert(@Body() dto: ConvertCurrencyDto) {
    return this.currencyService.convert(dto);
  }

  @Get('history')
  getHistory(@Query('userId') userId: string) {
    return this.currencyService.getHistory(userId);
  }
}
