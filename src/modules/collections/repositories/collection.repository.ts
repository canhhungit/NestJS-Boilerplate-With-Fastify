import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection, CollectionDocument } from 'src/schemas/collection.entity';
import { CollectionRepositoryInterface } from 'src/modules/collections/interfaces/collections.interface';
import { BaseRepositoryAbstract } from 'src/repositories/base/base.abstract.repository';

@Injectable()
export class CollectionRepository
  extends BaseRepositoryAbstract<CollectionDocument>
  implements CollectionRepositoryInterface
{
  constructor(
    @InjectModel(Collection.name)
    private readonly collection_model: Model<CollectionDocument>,
  ) {
    super(collection_model);
  }

  async getDetail(id: string): Promise<Collection> {
    return await this.collection_model
      .findById(id)
      .populate([{ path: 'detail' }]);
  }
}
