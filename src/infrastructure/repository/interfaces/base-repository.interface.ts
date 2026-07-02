import type {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
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
  exists(id: string | number): Promise<boolean>;
  existsBy(options: FindOptionsWhere<TEntity>): Promise<boolean>;
  toModel(entity: TEntity): TModel;
}