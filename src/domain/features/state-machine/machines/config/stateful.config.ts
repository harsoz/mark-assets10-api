/**
 * This file contains the configuration for the state machine that manages the different states of a project.
 * Each state has a set of possible events that can trigger transitions to other states, along with the actions to be executed during those transitions.
 */
export const statefulConfig = {
  // check this, it seems like the projects are created as PendingResources by default
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
};
