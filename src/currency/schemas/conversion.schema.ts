import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversionDocument = HydratedDocument<Conversion>;

@Schema({ timestamps: true })
export class Conversion {
  createdAt!: Date;

  updatedAt!: Date;

  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, uppercase: true })
  from!: string;

  @Prop({ required: true, uppercase: true })
  to!: string;

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({ required: true, min: 0 })
  rate!: number;

  @Prop({ required: true, min: 0 })
  result!: number;

  @Prop()
  rateDate?: string;
}

export const ConversionSchema = SchemaFactory.createForClass(Conversion);
ConversionSchema.index({ userId: 1, createdAt: -1 });
