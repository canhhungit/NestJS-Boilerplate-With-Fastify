import { Inject, Injectable } from '@nestjs/common';
import { Collection } from 'src/schemas/collection.entity';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { CollectionRepositoryInterface } from './interfaces/collections.interface';
import { FindAllResponse } from 'src/types/common.type';
import { Types } from 'mongoose';
import { generateNextKey } from 'src/shared/utils/pagination';

@Injectable()
export class CollectionsService extends BaseServiceAbstract<Collection> {
  /**
   *
   */
  constructor(
    @Inject('CollectionRepositoryInterface')
    private readonly collection_repository: CollectionRepositoryInterface,
  ) {
    super(collection_repository);
  }

  async findAll(
    filter?: object,
    options?: { offset: number; limit: number },
  ): Promise<FindAllResponse<Collection>> {
    return await this.collection_repository.findAll(filter, {
      skip: options.offset,
      limit: options.limit,
      sort: { _id: 1 },
    });
  }

  async findAllUsingKeysetPagination(
    filter: { search: string },
    { last_id }: { last_id: string },
    options: { limit: number },
  ): Promise<FindAllResponse<Collection>> {
    let pagination_query = {},
      api_query = {};
    let final_query = {};
    if (last_id) {
      pagination_query['_id'] = {
        $gt: new Types.ObjectId(last_id),
      };
    }
    if (filter.search) {
      api_query['name'] = {
        $regex: filter.search,
      };
      final_query['$and'] = [api_query, pagination_query];
    } else {
      final_query = pagination_query;
    }
    const [{ items }, count] = await Promise.all([
      this.collection_repository.findAll(final_query, {
        limit: options.limit,
        sort: { _id: 1 },
      }),
      this.collection_repository.count(api_query),
    ]);
    return {
      count,
      items,
      next_key: generateNextKey(items, ['name']),
    };
  }

  async getDetail(id: string): Promise<Collection> {
    return await this.collection_repository.getDetail(id);
  }
}
