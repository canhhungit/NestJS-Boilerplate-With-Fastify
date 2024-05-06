import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseEntity } from './base/base.entity';
import { CollectionDetail } from './collection-detail.entity';

export enum COLLECTION_LEVEL {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  CHAOS = 'chaos',
}

export type CollectionDocument = mongoose.HydratedDocument<Collection>;
@Schema({ timestamps: true })
export class Collection extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: COLLECTION_LEVEL.EASY, enum: COLLECTION_LEVEL })
  level: COLLECTION_LEVEL;

  @Prop()
  order: number;

  @Prop()
  image: string;

  @Prop({ default: 0, min: 0 })
  total_flash_cards: number;

  @Prop({ default: false })
  is_public: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollectionDetail',
    required: true,
  })
  detail: CollectionDetail;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
