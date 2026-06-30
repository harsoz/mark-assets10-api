import { createMachine } from 'xstate';

type ProjectEvent =
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

export const assetsMachine = createMachine({
  id: 'project',
  initial: 'Open',
  context: {
    project: null,
  },
  types: {} as {
    events: ProjectEvent;
    context: { project: any };
  },
  states: {
    PendingResources: {
      on: {
        'resources-assigned': { target: 'TechnicalReview' },
      },
    },
    TechnicalReview: {
      on: {
        'revision-accepted': { target: 'FinancingReview' },
        'revision-rejected': { target: 'Closed' },
      },
    },
    FinancingReview: {
      on: {
        'revision-accepted': { target: 'PromiseSignedWithPropietary' },
        'revision-rejected': { target: 'Closed' },
      },
    },
    PromiseSignedWithPropietary: {
      on: {
        'promise-accepted': { target: 'TitleNDAStudies' },
        'promise-rejected': { target: 'Closed' },
      },
    },
    TitleNDAStudies: {
      on: {
        'studies-accepted': { target: 'PromiseAgreementWithDeveloper' },
        'studies-rejected': { target: 'Closed' },
      },
    },
    PromiseAgreementWithDeveloper: {
      on: {
        'promise-accepted': { target: 'AnteProjectApproved' },
        'promise-rejected': { target: 'TitleNDAStudies' },
      },
    },
    AnteProjectApproved: {
      on: {
        'anteproject-accepted': { target: 'ApprovedTitles' },
        'anteproject-rejected': { target: 'Closed' },
      },
    },
    ApprovedTitles: {
      on: {
        'titles-accepted': { target: 'FinalPromiseAndPayment' },
        'titles-rejected': { target: 'Closed' },
      },
    },
    FinalPromiseAndPayment: {
      on: {
        'promise-paid': { target: 'Closed' },
        'promise-not-paid': { target: 'Closed' },
      },
    },
    Closed: {},
  },
});
