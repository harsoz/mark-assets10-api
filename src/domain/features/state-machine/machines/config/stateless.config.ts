/**
 * This events are valid for all the states, they are not related to any specific state transition.
 * They are general events that can be triggered at any time, regardless of the current state of the project.
 * The actions associated with these events will be executed when the event is triggered, but they will not cause a state transition.
 */
export const statelessConfig = {
  'add-contract': {
    actions: ['runOnPendingResources'],
  },
  'close-project': {
    actions: ['runOnPendingResources'],
  },
  'expire-project': {
    actions: ['runOnPendingResources'],
  },
};
