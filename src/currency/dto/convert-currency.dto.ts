import { IsDateString, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class ConvertCurrencyDto {
  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  from!: string;

  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  to!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  @Matches(/^\S+$/)
  userId!: string;

  @IsOptional()
  @IsDateString({ strict: true })
  date?: string;
}
