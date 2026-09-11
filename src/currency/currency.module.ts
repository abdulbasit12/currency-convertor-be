import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyController } from './currency.controller.js';
import { CurrencyService } from './currency.service.js';
import { Conversion, ConversionSchema } from './schemas/conversion.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversion.name, schema: ConversionSchema },
    ]),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
