import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { BaseEntity } from 'src/schemas/base/base.entity';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const created_data = await this.model.create(dto);
    return created_data.save() as any;
  }

  async findOneById(
    id: string,
    projection?: string,
    options?: QueryOptions<T>,
  ): Promise<T> {
    const item = await this.model.findById(id, projection, options);
    return item?.deletedAt ? null : item;
  }

  async findOneByCondition(condition = {}): Promise<T> {
    return await this.model
      .findOne({
        ...condition,
        deletedAt: null,
      })
      .exec();
  }

  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.countDocuments({ ...condition, deletedAt: null }),
      this.model.find(
        { ...condition, deletedAt: null },
        options?.projection,
        options,
      ),
    ]);

    return {
      count,
      items,
    };
  }

  async findOneAndUpdate(condition: object, dto: Partial<T>): Promise<T> {
    return await this.model.findOneAndUpdate(condition, dto);
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    return await this.model.findOneAndUpdate(
      { _id: id, deletedAt: null } as FilterQuery<T>,
      dto,
      { new: true },
    );
  }

  async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, {
        deletedAt: new Date(),
        isDelete: true,
      })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }

  async insertMany(items: T[]): Promise<T[]> {
    return (await this.model.insertMany(items)) as any;
  }

  async count(condition: object): Promise<number> {
    return await this.model.countDocuments(condition);
  }
}
