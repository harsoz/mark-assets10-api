import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  DynamicFieldRepository,
  UserDynamicFieldRepository,
} from 'src/infrastructure/repository';
import { DynamicFieldModel } from 'src/domain/models';
import { CreateOrUpdateFieldDTO } from './dtos/create-or-update-dynamic-field.dto';
import { UserDynamicFieldResponse } from 'src/domain/features/dynamic-field/responses/user-dynamic-field.response';

@Injectable()
export class DynamicFieldService {
  constructor(
    private readonly _dynamicFieldRepository: DynamicFieldRepository,
    private readonly _userDynamicFieldRepository: UserDynamicFieldRepository,
  ) {}

  /**
   * @description data only
   * @returns all dynamic fields.
   */
  async getAll(): Promise<{ totalCount: number; data: DynamicFieldModel[] }> {
    // use getRaw... to query data only
    const dynamicFields = await this._dynamicFieldRepository
      .createQueryBuilder('dynamicField')
      .select('dynamicField.id', 'id')
      .addSelect('dynamicField.profileType', 'profileType')
      .addSelect('dynamicField.profile', 'profile')
      .addSelect('dynamicField.jsonData', 'jsonData')
      .getRawMany();

    const mapped = dynamicFields.map((d) =>
      this._dynamicFieldRepository.toModel(d),
    );
    return { totalCount: dynamicFields.length, data: mapped };
  }

  /**
   * @description data only
   * @returns all dynamic fields.
   */
  async getByProfile(profile: string): Promise<DynamicFieldModel> {
    const dynamicField = await this._dynamicFieldRepository
      .createQueryBuilder('dynamicField')
      .select('dynamicField.id', 'id')
      .addSelect('dynamicField.profileType', 'profileType')
      .addSelect('dynamicField.profile', 'profile')
      .addSelect('dynamicField.jsonData', 'jsonData')
      .andWhere('dynamicField.profile = :profile', { profile })
      .getRawOne();
    if (!dynamicField)
      throw new NotFoundException('Dynamic field does not exist');
    return this._dynamicFieldRepository.toModel(dynamicField);
  }

  async create(payload: CreateOrUpdateFieldDTO): Promise<DynamicFieldModel> {
    const alreadyExist = await this._dynamicFieldRepository.existsBy({
      profile: payload.profile,
    });
    if (alreadyExist)
      throw new ConflictException('Dynamic field already exists');

    const dynamicFieldCreated = await this._dynamicFieldRepository.create({
      jsonData: payload.jsonData,
      profile: payload.profile,
      // profileType: payload.profileType, which one is the good one >:v
    });

    return this._dynamicFieldRepository.toModel(dynamicFieldCreated);
  }

  async update(
    payload: CreateOrUpdateFieldDTO,
    dynamicFieldId: number,
  ): Promise<boolean> {
    const dynamicField =
      await this._dynamicFieldRepository.exists(dynamicFieldId);
    if (!dynamicField)
      throw new NotFoundException('Dynamic field does not exist');

    const dynamicFieldUpdated = await this._dynamicFieldRepository.update(
      dynamicFieldId,
      { jsonData: payload.jsonData },
    );

    return !!dynamicFieldUpdated;
  }

  async delete(dynamicFieldId: number): Promise<boolean> {
    await this._dynamicFieldRepository.delete(dynamicFieldId);
    return true;
  }

  async getUserDynamicFields(
    userId: string,
  ): Promise<UserDynamicFieldResponse> {
    // it's more efficient to use getOne 
    const userDynamicField = await this._userDynamicFieldRepository
      .createQueryBuilder('userDynamicField')
      .leftJoinAndSelect('userDynamicField.dynamicField', 'dynamicField')
      .where('userDynamicField.userId = :userId', { userId })
      .getOne();

    if (!userDynamicField)
      throw new NotFoundException('Dynamic field configuration does not exist');

    // check this part
    return {
      userId: userId,
      profile: userDynamicField.dynamicField?.profile!,
      dynamicFieldValues: userDynamicField.dynamicFieldValues ?? '{}',
      dynamicField: this._dynamicFieldRepository.toModel(
        userDynamicField.dynamicField!,
      ),
    };
  }
}
