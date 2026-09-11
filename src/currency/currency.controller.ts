import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('currencies')
  getCurrencies() {
    return this.currencyService.getCurrencies();
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
