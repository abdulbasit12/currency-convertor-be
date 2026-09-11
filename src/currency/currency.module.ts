import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { Conversion, ConversionSchema } from './schemas/conversion.schema';

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
