import type { AuthCodeModel, CityModel, CountryModel, ConsultingArchitectureModel, DataUserProfileModel, DevelopmentModel, DynamicFieldModel, EmailTemplateModel, EnergyAssetModel, FinancingModel, InfrastructureModel, NaturalResourcesDevelopmentModel, NaturalResourcesFinancingModel, NotificationModel, ProjectFileModel, ProjectModel, RealStateModel, RegionModel, RoleModel, StateModel, SubRegionModel, TrustedDeviceModel, UserModel, UserDynamicFieldModel, UserProjectModel, VerifiedPhoneModel, EducationModel, ProfessionalExperienceModel } from 'src/domain/models';
import type { AuthCode } from 'src/infrastructure/database/authcode.entity';
import type { City } from 'src/infrastructure/database/city.entity';
import type { Country } from 'src/infrastructure/database/country.entity';
import type { ConsultingArchitecture } from 'src/infrastructure/database/projects/consulting-architecture.entity';
import type { DataUserProfile } from 'src/infrastructure/database/data-user-profile.entity';
import type { Development } from 'src/infrastructure/database/projects/development.entity';
import type { DynamicField } from 'src/infrastructure/database/dynamic-field.entity';
import type { EmailTemplate } from 'src/infrastructure/database/email-template.entity';
import type { EnergyAsset } from 'src/infrastructure/database/projects/energy-asset.entity';
import type { Financing } from 'src/infrastructure/database/projects/financing.entity';
import type { Infrastructure } from 'src/infrastructure/database/projects/infrastructure.entity';
import type { NaturalResourcesDevelopment } from 'src/infrastructure/database/projects/natural-resources-development.entity';
import type { NaturalResourcesFinancing } from 'src/infrastructure/database/projects/natural-resources-financing.entity';
import type { ProjectFile } from 'src/infrastructure/database/project-file.entity';
import type { Project } from 'src/infrastructure/database/projects/project.entity';
import type { RealState } from 'src/infrastructure/database/projects/real-state.entity';
import type { Region } from 'src/infrastructure/database/region.entity';
import type { Role } from 'src/infrastructure/database/role.entity';
import type { State } from 'src/infrastructure/database/state.entity';
import type { SubRegion } from 'src/infrastructure/database/subregion.entity';
import type { TrustedDevice } from 'src/infrastructure/database/trusted-device.entity';
import type { UserDynamicField } from 'src/infrastructure/database/user-dynamic-field.entity';
import type { UserProject } from 'src/infrastructure/database/user-project.entity';
import type { User } from 'src/infrastructure/database/user.entity';
import type { VerifiedPhone } from 'src/infrastructure/database/verified-phone.entity';
import type { Education } from 'src/infrastructure/database/education.entity';
import type { ProfessionalExperience } from 'src/infrastructure/database/professional-experience.entity';
import type { Notification } from 'src/infrastructure/database/notification.entity';

export function mapCountry(entity: Country): CountryModel {
  return {
    id: entity.id,
    name: entity.name,
    iso3: entity.iso3,
    iso2: entity.iso2,
    phoneCode: entity.phoneCode,
    numericCode: entity.numericCode,
    capital: entity.capital,
    currency: entity.currency,
    currencyName: entity.currencyName,
    currencySymbol: entity.currencySymbol,
    tld: entity.tld,
    nationality: entity.nationality,
    emoji: entity.emoji,
    emojiU: entity.emojiU,
    flag: entity.flag,
    native: entity.native,
    region: entity.region,
    subRegion: entity.subRegion,
    wikiDataId: entity.wikiDataId,
    timezones: entity.timezones,
    translations: entity.translations,
    regionId: entity.regionId,
    regionData: entity.regionData ? mapRegion(entity.regionData) : undefined,
    subRegionId: entity.subRegionId,
    subRegionData: entity.subRegionData ? mapSubRegion(entity.subRegionData) : undefined,
    states: entity.states?.map(mapState),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapState(entity: State): StateModel {
  return {
    id: entity.id,
    name: entity.name,
    countryCode: entity.countryCode,
    iso2: entity.iso2,
    flag: entity.flag,
    fipsCode: entity.fipsCode,
    type: entity.type,
    wikiDataId: entity.wikiDataId,
    countryId: entity.countryId,
    country: entity.country ? mapCountry(entity.country) : undefined,
    cities: entity.cities?.map(mapCity),
    latitude: entity.latitude,
    longitude: entity.longitude,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapCity(entity: City): CityModel {
  return {
    id: entity.id,
    name: entity.name,
    stateCode: entity.stateCode,
    countryId: entity.countryId,
    countryCode: entity.countryCode,
    flag: entity.flag,
    wikiDataId: entity.wikiDataId,
    stateId: entity.stateId,
    state: entity.state ? mapState(entity.state) : undefined,
    latitude: entity.latitude,
    longitude: entity.longitude,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapRegion(entity: Region): RegionModel {
  return {
    id: entity.id,
    name: entity.name,
    translations: entity.translations,
    flag: entity.flag,
    wikiDataId: entity.wikiDataId,
    subRegions: entity.subRegions?.map(mapSubRegion),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapSubRegion(entity: SubRegion): SubRegionModel {
  return {
    id: entity.id,
    name: entity.name,
    translations: entity.translations,
    flag: entity.flag,
    wikiDataId: entity.wikiDataId,
    regionId: entity.regionId,
    region: entity.region ? mapRegion(entity.region) : undefined,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapRole(entity: Role): RoleModel {
  return {
    id: entity.id,
    name: entity.name,
    isAdmin: entity.isAdmin,
  };
}

export function mapEducation(entity: Education): EducationModel {
  return {
    id: entity.id,
    institution: entity.institution,
    title: entity.title,
    certificationName: entity.certificationName,
    institutionCertifies: entity.institutionCertifies,
    certificationYear: entity.certificationYear,
    from: entity.from,
    to: entity.to,
    userId: entity.userId,
    user: entity.user ? mapUser(entity.user) : undefined,
  };
}

export function mapProfessionalExperience(entity: ProfessionalExperience): ProfessionalExperienceModel {
  return {
    id: entity.id,
    company: entity.company,
    position: entity.position,
    activities: entity.activities,
    from: entity.from,
    to: entity.to,
    countryId: entity.countryId,
    country: entity.country ? mapCountry(entity.country) : undefined,
    userId: entity.userId,
    user: entity.user ? mapUser(entity.user) : undefined,
  };
}

export function mapVerifiedPhone(entity: VerifiedPhone): VerifiedPhoneModel {
  return {
    id: entity.id,
    phoneNumber: entity.phoneNumber,
    userId: entity.userId,
    user: entity.user ? mapUser(entity.user) : undefined,
  };
}

export function mapTrustedDevice(entity: TrustedDevice): TrustedDeviceModel {
  return {
    id: entity.id,
    userId: entity.userId,
    deviceId: entity.deviceId,
    expiresAt: entity.expiresAt,
    user: entity.user ? mapUser(entity.user) : undefined,
  };
}

export function mapDynamicField(entity: DynamicField): DynamicFieldModel {
  return {
    id: entity.id,
    profileType: entity.profileType,
    profile: entity.profile,
    jsonData: entity.jsonData,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapDataUserProfile(entity: DataUserProfile): DataUserProfileModel {
  return {
    id: entity.id,
    userId: entity.userId,
    user: entity.user ? mapUser(entity.user) : undefined,
    profileDataId: entity.profileDataId,
    profileData: entity.profileData ? mapDynamicField(entity.profileData) : undefined,
    jsonData: entity.jsonData,
  };
}

export function mapUserDynamicField(entity: UserDynamicField): UserDynamicFieldModel {
  return {
    id: entity.id,
    userId: entity.userId,
    user: entity.user ? mapUser(entity.user) : undefined,
    dynamicFieldId: entity.dynamicFieldId,
    dynamicField: entity.dynamicField ? mapDynamicField(entity.dynamicField) : undefined,
    dynamicFieldValues: entity.dynamicFieldValues,
  };
}

export function mapProjectFile(entity: ProjectFile): ProjectFileModel {
  return {
    id: entity.id,
    type: entity.type,
    file: entity.file,
    fileName: entity.fileName,
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapProject(entity: Project): ProjectModel {
  return {
    id: entity.id,
    projectType: entity.projectType,
    status: entity.status,
    currency: entity.currency,
    measureUnit: entity.measureUnit,
    title: entity.title,
    address: entity.address,
    zipCode: entity.zipCode,
    description: entity.description,
    mainPicture: entity.mainPicture,
    latitude: entity.latitude,
    longitude: entity.longitude,
    sellingConditions: entity.sellingConditions,
    sellingWindow: entity.sellingWindow,
    restrictionsAndRequirements: entity.restrictionsAndRequirements,
    minPrice: entity.minPrice,
    maxPrice: entity.maxPrice,
    countryId: entity.countryId,
    stateId: entity.stateId,
    cityId: entity.cityId,
    ownerId: entity.ownerId,
    approverId: entity.approverId,
    lawyerId: entity.lawyerId,
    analystId: entity.analystId,
    clientId: entity.clientId,
    country: entity.country ? mapCountry(entity.country) : undefined,
    state: entity.state ? mapState(entity.state) : undefined,
    city: entity.city ? mapCity(entity.city) : undefined,
    owner: entity.owner ? mapUser(entity.owner) : undefined,
    approver: entity.approver ? mapUser(entity.approver) : undefined,
    lawyer: entity.lawyer ? mapUser(entity.lawyer) : undefined,
    analyst: entity.analyst ? mapUser(entity.analyst) : undefined,
    client: entity.client ? mapUser(entity.client) : undefined,
    projectFiles: entity.projectFiles?.map(mapProjectFile),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapAuthCode(entity: AuthCode): AuthCodeModel {
  return {
    id: entity.id,
    userId: entity.userId,
    code: entity.code,
    used: entity.used,
    expiresAt: entity.expiresAt,
    user: entity.user ? mapUser(entity.user) : undefined,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapEmailTemplate(entity: EmailTemplate): EmailTemplateModel {
  return {
    id: entity.id,
    name: entity.name,
    subject: entity.subject,
    note: entity.note,
    template: entity.template,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapNotification(entity: Notification): NotificationModel {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapUserProject(entity: UserProject): UserProjectModel {
  return {
    id: entity.id,
    userId: entity.userId,
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    projectType: entity.projectType,
    status: entity.status,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapConsultingArchitecture(entity: ConsultingArchitecture): ConsultingArchitectureModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    projectSubtype: entity.projectSubtype,
    serviceType: entity.serviceType,
    landAvailable: entity.landAvailable,
  };
}

export function mapDevelopment(entity: Development): DevelopmentModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    projectSubtype: entity.projectSubtype,
    landAvailable: entity.landAvailable,
    landArea: entity.landArea,
    activeType: entity.activeType,
    quantity: entity.quantity,
  };
}

export function mapEnergyAsset(entity: EnergyAsset): EnergyAssetModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    projectSubtype: entity.projectSubtype,
    infrastructureType: entity.infrastructureType,
    energyOutput: entity.energyOutput,
    segment: entity.segment,
    storageIncluded: entity.storageIncluded,
    ppaContract: entity.ppaContract,
  };
}

export function mapFinancing(entity: Financing): FinancingModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    projectSubtype: entity.projectSubtype,
    amount: entity.amount,
    dontDisclouse: entity.dontDisclouse,
    landAvailable: entity.landAvailable,
    activeType: entity.activeType,
  };
}

export function mapInfrastructure(entity: Infrastructure): InfrastructureModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    infrastructureType: entity.infrastructureType,
    energyOutput: entity.energyOutput,
    segment: entity.segment,
    landArea: entity.landArea,
  };
}

export function mapNaturalResourcesDevelopment(entity: NaturalResourcesDevelopment): NaturalResourcesDevelopmentModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    energyOutput: entity.energyOutput,
    segment: entity.segment,
    activeType: entity.activeType,
  };
}

export function mapNaturalResourcesFinancing(entity: NaturalResourcesFinancing): NaturalResourcesFinancingModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    projectSubtype: entity.projectSubtype,
    activeType: entity.activeType,
  };
}

export function mapRealState(entity: RealState): RealStateModel {
  return {
    projectId: entity.projectId,
    project: entity.project ? mapProject(entity.project) : undefined,
    landArea: entity.landArea,
    realStateType: entity.realStateType,
    quantity: entity.quantity,
    sizeInAcres: entity.sizeInAcres,
    sizeInSqft: entity.sizeInSqft,
    totalPrice: entity.totalPrice,
    pricePerAcre: entity.pricePerAcre,
    suggestedUse: entity.suggestedUse,
    residentialSubType: entity.residentialSubType,
    relationShipWithOwner: entity.relationShipWithOwner,
    ownersIntention: entity.ownersIntention,
    parcelId: entity.parcelId,
  };
}

export function mapUser(entity: User): UserModel {
  return {
    id: entity.id,
    email: entity.email,
    phoneNumber: entity.phoneNumber,
    name: entity.name,
    password: entity.password,
    phoneVerificationCode: entity.phoneVerificationCode,
    rewardClaimed: entity.rewardClaimed,
    isAdmin: entity.isAdmin,
    isFirstPasswordChanged: entity.isFirstPasswordChanged,
    status: entity.status,
    aboutMe: entity.aboutMe,
    xSocial: entity.xSocial,
    linkedIn: entity.linkedIn,
    logo: entity.logo,
    profilePicture: entity.profilePicture,
    address: entity.address,
    projectCapacity: entity.projectCapacity,
    aboutCompany: entity.aboutCompany,
    language: entity.language,
    roles: entity.roles?.map(mapRole),
    professionalExperience: entity.professionalExperience?.map(mapProfessionalExperience),
    education: entity.education?.map(mapEducation),
    verifiedPhones: entity.verifiedPhones?.map(mapVerifiedPhone),
    dynamicFields: entity.dynamicFields?.map(mapUserDynamicField),
    trustedDevices: entity.trustedDevices?.map(mapTrustedDevice),
    countryId: entity.countryId,
    country: entity.country ? mapCountry(entity.country) : undefined,
    stateId: entity.stateId,
    state: entity.state ? mapState(entity.state) : undefined,
    cityId: entity.cityId,
    city: entity.city ? mapCity(entity.city) : undefined,
  };
}
