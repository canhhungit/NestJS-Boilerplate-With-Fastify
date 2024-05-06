import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseEntity } from './base/base.entity';

export type CollectionDetailDocument =
  mongoose.HydratedDocument<CollectionDetail>;
@Schema({ timestamps: true })
export class CollectionDetail extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const CollectionDetailSchema =
  SchemaFactory.createForClass(CollectionDetail);
