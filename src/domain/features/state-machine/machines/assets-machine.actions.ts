import { Injectable } from '@nestjs/common';
import { setup } from 'xstate';
import { OnPendingResourcesEvent } from '../events/on-pending-resources.event';
import { ProjectModel } from 'src/domain/models';

// the allowed events for the assets machine
type ProjectEvent =
  | { type: 'approved' }
  | { type: 'rejected' }
  | { type: 'resources-assigned' }
  | { type: 'revision-accepted' }
  | { type: 'revision-rejected' }
  | { type: 'promise-rejected' }
  | { type: 'promise-accepted' }
  | { type: 'studies-accepted' }
  | { type: 'studies-rejected' }
  | { type: 'anteproject-accepted' }
  | { type: 'anteproject-rejected' }
  | { type: 'titles-accepted' }
  | { type: 'titles-rejected' }
  | { type: 'promise-paid' }
  | { type: 'promise-not-paid' };

@Injectable()
export class AssetsMachineActions {
  constructor(private readonly _onPendingResources: OnPendingResourcesEvent) {}

  setupMachine() {
    return setup({
      types: {} as {
        input: { project: ProjectModel };
        events: ProjectEvent;
        context: { project: ProjectModel | null };
      },
      actions: {
        runOnPendingResources: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnTechnicalReview: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnTechnicalReviewAccepted: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnTechnicalReviewRejected: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnFinancingReviewAccepted: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnFinancingReviewRejected: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnPromiseSignedWithPropietaryAccepted: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnPromiseSignedWithPropietaryRejected: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnTitleNDAStudiesAccepted: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnTitleNDAStudiesRejected: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnPromiseAgreementWithDeveloperAccepted: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnPromiseAgreementWithDeveloperRejected: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnAnteProjectApprovedAccepted: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnAnteProjectApprovedRejected: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnApprovedTitlesAccepted: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnApprovedTitlesRejected: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnFinalPromiseAndPaymentPaid: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
        runOnFinalPromiseAndPaymentNotPaid: ({ context }) => this._onPendingResources.run(context.project as ProjectModel),
      },
    });
  }
}