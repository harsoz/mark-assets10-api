import type { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseRepository<TEntity extends ObjectLiteral, TModel> {
  constructor(protected readonly repository: Repository<TEntity>, protected readonly primaryKey: keyof TEntity = 'id' as any) {}

  protected buildPrimaryKeyCriteria(id: string | number): FindOptionsWhere<TEntity> {
    return { [this.primaryKey]: id } as FindOptionsWhere<TEntity>;
  }

  async create(createData: DeepPartial<TEntity>): Promise<TModel> {
    const entity = this.repository.create(createData);
    const saved = await this.repository.save(entity);
    return this.toModel(saved);
  }

  async findById(id: string | number, options?: FindOneOptions<TEntity>): Promise<TModel | null> {
    const entity = await this.repository.findOne({ where: this.buildPrimaryKeyCriteria(id), ...options } as FindOneOptions<TEntity>);
    return entity ? this.toModel(entity) : null;
  }

  async update(id: string | number, updateData: DeepPartial<TEntity>): Promise<TModel | null> {
    await this.repository.update(this.buildPrimaryKeyCriteria(id), updateData as any);
    const entity = await this.repository.findOne({ where: this.buildPrimaryKeyCriteria(id) } as FindOneOptions<TEntity>);
    return entity ? this.toModel(entity) : null;
  }

  async delete(id: string | number): Promise<void> {
    await this.repository.delete(this.buildPrimaryKeyCriteria(id) as any);
  }

  createQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }

  async findOne(options: FindOneOptions<TEntity>): Promise<TEntity | null> {
    return await this.repository.findOne(options);
  }

  async findAll(options?: FindManyOptions<TEntity>): Promise<TModel[]> {
    const entities = await this.repository.find(options);
    return entities.map((entity) => this.toModel(entity));
  }

  protected abstract toModel(entity: TEntity): TModel;
}
