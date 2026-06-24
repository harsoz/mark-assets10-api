import type {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  SelectQueryBuilder
} from 'typeorm';

export interface IBaseRepository<TEntity extends ObjectLiteral, TModel> {
  create(createData: DeepPartial<TEntity>): Promise<TEntity>;
  findById(id: string | number, options?: FindOneOptions<TEntity>): Promise<TEntity | null>;
  update(id: string | number, updateData: DeepPartial<TEntity>): Promise<TEntity | null>;
  delete(id: string | number): Promise<void>;
  createQueryBuilder(alias: string): SelectQueryBuilder<TEntity>;
  findOne(options: FindOneOptions<TEntity>): Promise<TEntity | null>;
  findAll(options?: FindManyOptions<TEntity>): Promise<TEntity[]>;
  count(options?: FindManyOptions<TEntity>): Promise<number> ;
  toModel(entity: TEntity): TModel;
}