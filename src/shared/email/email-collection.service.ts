import { Injectable } from '@nestjs/common';
import { AccountCreatedStrategy } from './strategies/account-created.strategy';
import { IEmailStrategy } from './interfaces/email-strategy.interface';
import { TwoFactorStrategy } from './strategies/2fa.strategy';
import { ContractUploadedStrategy } from './strategies/contract-uploaded.strategy';
import { InfoFormStrategy } from './strategies/info-form.strategy';
import { ProjectAssignedStrategy } from './strategies/project-assigned.strategy';
import { ProjectApprovedStrategy } from './strategies/project-approved.stragegy';
import { ProjectClosedStrategy } from './strategies/project-closed.strategy';
import { ProjectCompletedStrategy } from './strategies/project-completed.strategy';
import { ProjectCreatedStrategy } from './strategies/project-created.strategy';
import { ProjectDeletedStrategy } from './strategies/project-deleted.strategy';
import { ProjectExpiredStrategy } from './strategies/project-expired.strategy';
import { ResetPasswordStrategy } from './strategies/reset-password.strategy';

@Injectable()
export class EmailCollectionService {
  private readonly _dictionary: Map<string, IEmailStrategy> = new Map([
    ['account-created', new AccountCreatedStrategy()],
    ['2fa', new TwoFactorStrategy()],
    ['contract-uploaded', new ContractUploadedStrategy()],
    ['info-form', new InfoFormStrategy()],
    ['project-assigned', new ProjectAssignedStrategy()],
    ['project-approved', new ProjectApprovedStrategy()],
    ['project-closed', new ProjectClosedStrategy()],
    ['project-completed', new ProjectCompletedStrategy()],
    ['project-created', new ProjectCreatedStrategy()],
    ['project-deleted', new ProjectDeletedStrategy()],
    ['project-expired', new ProjectExpiredStrategy()],
    ['reset-password', new ResetPasswordStrategy()],
  ]);

  getEmailEngine(type: string) {
    return this._dictionary.get(type);
  }
}
