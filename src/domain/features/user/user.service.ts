import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from 'src/domain/models';
import {
  EducationRepository,
  ProfessionalExperienceRepository,
  UnitOfWork,
  UserRepository,
} from 'src/infrastructure/repository';
import { GetRestrictedUserDTO } from './dtos/get-restricted-user.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { StorageService } from 'src/shared/third-parties/storage.service';
import {
  DynamicField,
  ProfessionalExperience,
  Role,
  User,
  UserDynamicField,
} from 'src/infrastructure/database';
import * as bcrypt from 'bcrypt';
import { In } from 'typeorm';
import { LanguageType } from 'src/domain/types/language.type';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UpdateUserProjectsCapacityDTO } from './dtos/update-user-projects-capacity.dto';
import { AddProfessionalExperienceDTO } from './dtos/add-professional-experience.dto';
import { AddEducationDTO } from './dtos/add-education.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _storageService: StorageService,
    private readonly _professionalExperienceRepository: ProfessionalExperienceRepository,
    private readonly _educationRepository: EducationRepository,
    private readonly _unitOfWork: UnitOfWork,
  ) {}

  /**
   * @description mainly used by chat
   * @returns all users with no projects
   */
  async getAll() {
    // potentially we can send the list of user with no details only
    const query = this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .leftJoinAndSelect(
        'user.professionalExperience',
        'professionalExperience',
      )
      .leftJoinAndSelect('user.education', 'education');

    const [data, totalCount] = await query.getManyAndCount();

    return { data: data as UserModel[], totalCount };
  }

  // also use for GetUserByProfileType in legacy
  async getAllPaginated(
    request: GetRestrictedUserDTO,
    requestedRoles?: string,
  ) {
    const query = this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .leftJoinAndSelect(
        'user.professionalExperience',
        'professionalExperience',
      )
      .leftJoinAndSelect('user.education', 'education');

    if (request.search) {
      query.andWhere('user.name LIKE :search', {
        search: `%${request.search}%`,
      });
    }
    if (requestedRoles) {
      const rolesArray = requestedRoles.split(',').map((r) => r.toLowerCase());
      query.andWhere('LOWER(role.name) IN (:...rolesArray)', { rolesArray });
    }

    if (request.profileType) {
      query.andWhere('user.profileType = :profileType', {
        profileType: request.profileType,
      });
    }

    const sortField = request.sort || 'createdAt';
    const order = (request.order || 'ASC').toUpperCase() as 'ASC' | 'DESC';
    query.orderBy(`user.${sortField}`, order);

    const [data, totalCount] = await query
      .skip(((request.page || 0) - 1) * (request.pageSize || 0))
      .take(request.pageSize)
      .getManyAndCount();

    const mappedUsers = data.map((user) => {
      const userModel = this._userRepository.toModel(user);
      const mapped = {
        ...userModel,
        roles: user.roles ? user.roles.map((r) => r.name).join(', ') : '',
      };

      return mapped;
    });

    return { totalCount, data: mappedUsers };
  }

  // GetUserById as GetUserWithProjects is declared in projects controller

  async create(
    payload: CreateUserDTO,
    files: {
      profilePicture?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
  ) {
    return await this._unitOfWork.runInTransaction(async (manager) => {
      if (payload.password !== payload.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      let profilePicUrl: string | null = null;
      let logoPicUrl: string | null = null;

      if (files.profilePicture?.[0]) {
        const file = files.profilePicture[0];
        profilePicUrl = await this._storageService.uploadFile(file);
      }

      if (files.logo?.[0]) {
        const file = files.logo[0];
        logoPicUrl = await this._storageService.uploadFile(file);
      }

      const alreadyExist = await manager.findOne(User, {
        where: { email: payload.email },
      });
      if (alreadyExist) {
        throw new ConflictException('User already exists');
      }

      const user = manager.create(User, {
        email: payload.email,
        name: payload.name,
        status: payload.status,
        phoneNumber: payload.phoneNumber,
        address: payload.address,
        countryId: payload.countryId,
        stateId: payload.stateId,
        cityId: payload.cityId,
        isAdmin: true,
        twoFactorEnabled: true,
        // emailConfirmed: true,
        // lockoutEnabled: true,
        // normalizedUserName: payload.name.toUpper(),
        // normalizedEmail: payload.email.toUpper(),
        profilePicture: profilePicUrl || undefined,
        logo: logoPicUrl || undefined,
        language: LanguageType.ES,
        profileType: payload.dynamicFieldProfile,
      });

      user.password = await bcrypt.hash(payload.password, 10);

      const savedUser = await manager.save(user);

      if (payload.dynamicFieldProfile) {
        const dynamicField = await manager.findOne(DynamicField, {
          where: { profile: payload.dynamicFieldProfile },
        });

        const userDynamicField = manager.create(UserDynamicField, {
          userId: savedUser.id,
          dynamicFieldId: dynamicField?.id,
          dynamicFieldValues: payload.jsonData,
        });

        await manager.save(userDynamicField);
      }

      if (payload.roles) {
        const roleNames = payload.roles.split(',');

        const rolesEntities = await manager.find(Role, {
          where: { name: In(roleNames) },
        });
        savedUser.roles = rolesEntities;

        await manager.save(savedUser);
      }
      return this._userRepository.toModel(savedUser);
    });
  }

  async update(
    userId: string,
    payload: UpdateUserDTO,
    files: {
      profilePicture?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
  ) {
    return await this._unitOfWork.runInTransaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      if (files.profilePicture?.[0]) {
        user.profilePicture = await this._storageService.uploadFile(
          files.profilePicture[0],
        );
      }
      if (files.logo?.[0]) {
        user.logo = await this._storageService.uploadFile(files.logo[0]);
      }

      user.name = payload.name;
      user.status = payload.status;
      user.phoneNumber = payload.phoneNumber;
      user.address = payload.address;
      user.countryId = payload.countryId;
      user.stateId = payload.stateId;
      user.cityId = payload.cityId;
      user.language = payload.language || user.language;

      if (payload.jsonData) {
        let userDynamicField = await manager.findOne(UserDynamicField, {
          where: { userId: user.id },
        });

        if (userDynamicField) {
          userDynamicField.dynamicFieldValues = payload.jsonData;
          await manager.save(userDynamicField);
        }
      }

      if (payload.roles) {
        const roleNames = payload.roles.split(',');
        const rolesEntities = await manager.find(Role, {
          where: { name: In(roleNames) },
        });

        user.roles = rolesEntities;
      }

      const savedUser = await manager.save(user);
      return this._userRepository.toModel(savedUser);
    });
  }

  async delete(userId: string) {
    await this._userRepository.delete(userId);
    return true;
  }

  async updateUserProjectsCapacity(
    capacity: UpdateUserProjectsCapacityDTO,
    userId: string,
  ) {
    const user = await this._userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User does not exist');

    user.projectCapacity = capacity.newCapacity;

    await this._userRepository.update(user.id, user);

    return true;
  }

  async addProfessionalExperience(
    payload: AddProfessionalExperienceDTO,
    userId: string,
  ) {
    const experience = await this._professionalExperienceRepository.create({
      company: payload.company,
      position: payload.position,
      countryId: payload.countryId,
      activities: payload.activities,
      from: payload.from,
      to: payload.to,
      userId: userId,
    });

    return this._professionalExperienceRepository.toModel(experience);
  }

  async addEducation(payload: AddEducationDTO, userId: string) {
    const education = await this._educationRepository.create({
      institution: payload.institution,
      certificationName: payload.certificationName,
      title: payload.title,
      institutionCertifies: payload.institutionCertifies,
      certificationYear: new Date(payload.certificationYear)
        .getFullYear()
        .toString(),
      from: payload.from,
      to: payload.to,
      userId: userId,
    });

    return this._educationRepository.toModel(education);
  }

  async deleteProfessionalExperience(professionalExperienceId: string) {
    await this._professionalExperienceRepository.delete(professionalExperienceId);
    return true;
  }

  async deleteEducation(educationId: string) {
    await this._educationRepository.delete(educationId);
    return true;
  }
}
