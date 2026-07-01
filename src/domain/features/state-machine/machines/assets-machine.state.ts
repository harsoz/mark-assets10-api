import { Injectable } from '@nestjs/common';
import { ProjectModel } from 'src/domain/models';
import { IStateMachine } from '../interfaces/state-machine.interface';
import { AssetsMachineActions } from './assets-machine.actions';

@Injectable()
export class AssetsMachine implements IStateMachine {
  constructor(private readonly _actions: AssetsMachineActions) {}

  getStateMachine(state: string) {
    const assetsMachine = this._actions.setupMachine().createMachine({
      id: 'project',
      initial: state,
      context: ({ input }) => ({
        project: input?.project as ProjectModel,
      }),
      states: {
        Draft: {
          on: {
            approved: {
              target: 'PendingResources',
              actions: 'runOnPendingResources',
            },
            rejected: { target: 'Closed' },
          },
        },
        PendingResources: {
          on: {
            'resources-assigned': {
              target: 'TechnicalReview',
              actions: 'runOnTechnicalReview',
            },
          },
        },
        TechnicalReview: {
          on: {
            'revision-accepted': {
              target: 'FinancingReview',
              actions: 'runOnTechnicalReviewAccepted',
            },
            'revision-rejected': {
              target: 'Closed',
              actions: 'runOnTechnicalReviewRejected',
            },
          },
        },
        FinancingReview: {
          on: {
            'revision-accepted': {
              target: 'PromiseSignedWithPropietary',
              actions: 'runOnFinancingReviewAccepted',
            },
            'revision-rejected': {
              target: 'Closed',
              actions: 'runOnFinancingReviewRejected',
            },
          },
        },
        PromiseSignedWithPropietary: {
          on: {
            'promise-accepted': {
              target: 'TitleNDAStudies',
              actions: 'runOnPromiseSignedWithPropietaryAccepted',
            },
            'promise-rejected': {
              target: 'Closed',
              actions: 'runOnPromiseSignedWithPropietaryRejected',
            },
          },
        },
        TitleNDAStudies: {
          on: {
            'studies-accepted': {
              target: 'PromiseAgreementWithDeveloper',
              actions: 'runOnTitleNDAStudiesAccepted',
            },
            'studies-rejected': {
              target: 'Closed',
              actions: 'runOnTitleNDAStudiesRejected',
            },
          },
        },
        PromiseAgreementWithDeveloper: {
          on: {
            'promise-accepted': {
              target: 'AnteProjectApproved',
              actions: 'runOnPromiseAgreementWithDeveloperAccepted',
            },
            'promise-rejected': {
              target: 'TitleNDAStudies',
              actions: 'runOnPromiseAgreementWithDeveloperRejected',
            },
          },
        },
        AnteProjectApproved: {
          on: {
            'anteproject-accepted': {
              target: 'ApprovedTitles',
              actions: 'runOnAnteProjectApprovedAccepted',
            },
            'anteproject-rejected': {
              target: 'Closed',
              actions: 'runOnAnteProjectApprovedRejected',
            },
          },
        },
        ApprovedTitles: {
          on: {
            'titles-accepted': {
              target: 'FinalPromiseAndPayment',
              actions: 'runOnApprovedTitlesAccepted',
            },
            'titles-rejected': {
              target: 'Closed',
              actions: 'runOnApprovedTitlesRejected',
            },
          },
        },
        FinalPromiseAndPayment: {
          on: {
            'promise-paid': {
              target: 'Closed',
              actions: 'runOnFinalPromiseAndPaymentPaid',
            },
            'promise-not-paid': {
              target: 'Closed',
              actions: 'runOnFinalPromiseAndPaymentNotPaid',
            },
          },
        },
        Closed: {},
      },
    });

    return assetsMachine;
  }
}
