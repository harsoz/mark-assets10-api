import { createMachine, assign } from 'xstate';

function hasRequiredFiles (context: any) {
    return context.project.files && context.project.files.length > 0;
}

type ProjectEvent = 
  | { type: 'SUBMIT' } 
  | { type: 'APPROVE' } 
  | { type: 'REJECT' };

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
    PendingToApprove: {
      on: {
        // projects events
        SUBMIT: {
          target: 'ANALYSIS',
          // guard: hasRequiredFiles,
          // actions: () => {

          // }
        }
      }
    },
    PendingResources: {
      on: {
        APPROVE: { target: 'APPROVED' },
        REJECT: { target: 'REJECTED' }
      }
    },
    AgreementClosed: {},
    TechnicalReview: {},
    FinalClosing: {},
    Approved: {},
    Rejected: {},
  }
});