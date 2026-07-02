import { Injectable } from '@nestjs/common';
import { setup } from 'xstate';
import { OnPendingResourcesEvent } from '../../events/on-pending-resources.event';
import { ProjectModel } from 'src/domain/models';
import { StatefulEvents } from './stateful-events';

/**
 * This class defines the actions to be executed during state transitions in the state machine.
 * Each action corresponds to a specific event and is responsible for executing the necessary logic when that event is triggered.
 */
@Injectable()
export class StatefulActions {
  constructor(private readonly _onPendingResources: OnPendingResourcesEvent) {}

  setupActions() {
    return setup({
      types: {} as {
        input: { project: ProjectModel, args: any };
        events: StatefulEvents;
        context: { project: ProjectModel | null, args: any };
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