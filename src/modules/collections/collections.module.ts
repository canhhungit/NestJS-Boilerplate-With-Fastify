import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from 'src/schemas/collection.entity';
import { CollectionRepository } from './repositories/collection.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [
    CollectionsService,
    {
      provide: 'CollectionRepositoryInterface',
      useClass: CollectionRepository,
    },
  ],
})
export class CollectionsModule {}
