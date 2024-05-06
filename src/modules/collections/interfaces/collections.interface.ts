import { BaseRepositoryInterface } from 'src/repositories/base/base.interface.repository';
import { Collection } from 'src/schemas/collection.entity';

// export type CollectionRepositoryInterface = BaseRepositoryInterface<Collection>;

export interface CollectionRepositoryInterface
  extends BaseRepositoryInterface<Collection> {
  getDetail(id: string): Promise<Collection>;
}
