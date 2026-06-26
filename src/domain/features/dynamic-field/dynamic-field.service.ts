import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  DynamicFieldRepository,
  UserDynamicFieldRepository,
} from 'src/infrastructure/repository';
import { DynamicFieldModel, UserDynamicFieldModel } from 'src/domain/models';
import { CreateOrUpdateFieldDTO } from './dtos/create-or-update-dynamic-field.dto';
import { UserDynamicFieldRecordModel } from 'src/domain/models/user-dynamic-field-record.model';

@Injectable()
export class DynamicFieldService {
  constructor(
    private readonly _dynamicFieldRepository: DynamicFieldRepository,
    private readonly _userDynamicFieldRepository: UserDynamicFieldRepository,
  ) {}

  async getAll(): Promise<{ totalCount: number; data: DynamicFieldModel[] }> {
    const [data, totalCount] = await this._dynamicFieldRepository
      .createQueryBuilder('dynamicField')
      .getManyAndCount();
    return { totalCount, data: data as DynamicFieldModel[] };
  }

  async getByProfile(profile: string): Promise<DynamicFieldModel> {
    const result = await this._dynamicFieldRepository.findOne({
      where: { profile },
    });
    if (!result)
      throw new NotFoundException('Dynamic field page does not exist');
    return this._dynamicFieldRepository.toModel(result);
  }

  async create(request: CreateOrUpdateFieldDTO): Promise<DynamicFieldModel> {
    const alreadyExist = await this._dynamicFieldRepository.findOne({
      where: { profile: request.profile },
    });
    if (alreadyExist)
      throw new ConflictException('Dynamic field already exists');

    const dynamicFieldCreated = await this._dynamicFieldRepository.create({
      jsonData: request.jsonData,
      profile: request.profile,
    });

    return this._dynamicFieldRepository.toModel(dynamicFieldCreated);
  }

  async update(
    request: CreateOrUpdateFieldDTO,
    dynamicFieldId: number,
  ): Promise<boolean> {
    const dynamicField = await this._dynamicFieldRepository.findOne({
      where: { id: dynamicFieldId },
    });
    if (!dynamicField)
      throw new NotFoundException('Dynamic field page does not exist');

    dynamicField.jsonData = request.jsonData;
    const dynamicFieldUpdated = await this._dynamicFieldRepository.update(
      dynamicFieldId,
      dynamicField,
    );

    return !!dynamicFieldUpdated;
  }

  async delete(dynamicFieldId: number): Promise<boolean> {
    await this._dynamicFieldRepository.delete(dynamicFieldId);
    return true;
  }

  async getUserDynamicFields(
    userId: string,
  ): Promise<UserDynamicFieldRecordModel> {
    const user = await this._userDynamicFieldRepository
      .createQueryBuilder('userDynamicField')
      .leftJoinAndSelect('userDynamicField.dynamicField', 'dynamicField')
      .where('userDynamicField.userId = :userId', { userId })
      .getOne();

    if (!user)
      throw new NotFoundException('Dynamic field configuration does not exist');

    // check this part
    return {
      userId: userId,
      profile: user.dynamicField?.profile!,
      dynamicFieldValues: user.dynamicFieldValues ?? '{}',
      dynamicField: user.dynamicField,
    };
  }

  // not sure what was this method doing, it seems like it's the same like the first one
//   async getProfiles(): Promise<{
//     totalCount: number;
//     data: DynamicFieldModel[];
//   }> {
//     const [data, totalCount] = await this._dynamicFieldRepository
//       .createQueryBuilder('dynamicField')
//       .getManyAndCount();

//     return { totalCount, data };
//   }
}
