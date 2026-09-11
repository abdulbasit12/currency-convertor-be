import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class HistoricalRatesDto {
  @IsOptional()
  @IsDateString({ strict: true })
  date?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  base_currency?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{3}(,[A-Za-z]{3})*$/)
  currencies?: string;
}
