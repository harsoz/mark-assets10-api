import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { sampleFeeds } from './sample-feeds';
import {
  AuthCode,
  City,
  Country,
  DataUserProfile,
  DynamicField,
  Education,
  EmailTemplate,
  EnergyAsset,
  Financing,
  Infrastructure,
  Notification,
  ProfessionalExperience,
  Project,
  ProjectFile,
  RealState,
  Region,
  Role,
  State,
  SubRegion,
  TrustedDevice,
  User,
  UserDynamicField,
  UserProject,
  VerifiedPhone,
  ConsultingArchitecture,
  Development,
  NaturalResourcesDevelopment,
  NaturalResourcesFinancing,
} from '../index';

@Injectable()
export class SampleFeedSeeder implements OnModuleInit {
  private readonly logger = new Logger(SampleFeedSeeder.name);

  private readonly insertionOrder: Array<keyof typeof sampleFeeds> = [
    'roles',
    'regions',
    'subregions',
    'countries',
    'states',
    'cities',
    'users',
    'dynamicFields',
    'userDynamicFields',
    'dataUserProfiles',
    'professionalExperiences',
    'educations',
    'verifiedPhones',
    'trustedDevices',
    'projects',
    'userProjects',
    'projectFiles',
    'emailTemplates',
    'notifications',
    'authCodes',
    'energyAssets',
    'consultingArchitectures',
    'developments',
    'financings',
    'infrastructures',
    'naturalResourcesDevelopments',
    'naturalResourcesFinancings',
    'realStates',
  ];

  // This map is ordered according to insertion dependencies.
  // Entities with no foreign-key dependencies must be seeded first.
  private readonly entityMap = {
    roles: Role,
    regions: Region,
    subregions: SubRegion,
    countries: Country,
    states: State,
    cities: City,
    users: User,
    dynamicFields: DynamicField,
    userDynamicFields: UserDynamicField,
    dataUserProfiles: DataUserProfile,
    professionalExperiences: ProfessionalExperience,
    educations: Education,
    verifiedPhones: VerifiedPhone,
    trustedDevices: TrustedDevice,
    projects: Project,
    userProjects: UserProject,
    projectFiles: ProjectFile,
    emailTemplates: EmailTemplate,
    notifications: Notification,
    authCodes: AuthCode,
    energyAssets: EnergyAsset,
    consultingArchitectures: ConsultingArchitecture,
    developments: Development,
    financings: Financing,
    infrastructures: Infrastructure,
    naturalResourcesDevelopments: NaturalResourcesDevelopment,
    naturalResourcesFinancings: NaturalResourcesFinancing,
    realStates: RealState,
  } as const;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.feedDatabase();
  }

  async feedDatabase(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }

    this.logger.log('Starting sample data seeding...');

    for (const feedKey of this.insertionOrder) {
      const entity = this.entityMap[feedKey];
      const records = sampleFeeds[feedKey];

      if (!entity) {
        this.logger.warn(`No entity mapping found for feed key "${feedKey}".`);
        continue;
      }

      if (!records || records.length === 0) {
        this.logger.log(`Skipping empty feed category "${feedKey}".`);
        continue;
      }

      const repository = this.dataSource.getRepository(entity);
      const existingCount = await repository.count();

      if (existingCount > 0) {
        this.logger.log(`Skipping "${feedKey}" because ${existingCount} records already exist.`);
        continue;
      }

      await repository.insert(records as any[]);
      this.logger.log(`Seeded ${records.length} record(s) into "${feedKey}".`);
    }

    this.logger.log('Sample data seeding completed.');
  }
}
