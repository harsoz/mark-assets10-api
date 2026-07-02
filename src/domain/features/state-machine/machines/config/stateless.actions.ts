import { Injectable } from '@nestjs/common';
import { setup } from 'xstate';
import { OnPendingResourcesEvent } from '../../events/on-pending-resources.event';
import { ProjectModel } from 'src/domain/models';
import { StatelessEvents } from './stateless-events';

/**
 * This class defines the actions to be executed during state transitions in the state machine.
 * Each action corresponds to a specific event and is responsible for executing the necessary logic when that event is triggered.
 */
@Injectable()
export class StatelessActions {
  constructor(private readonly _onPendingResources: OnPendingResourcesEvent) {}

  setupActions() {
    return setup({
      types: {} as {
        input: { project: ProjectModel, args: any };
        events: StatelessEvents;
        context: { project: ProjectModel | null, args: any };
      },
      actions: {
        runOnPendingResources: ({ context }) => this._onPendingResources.run(context.project as ProjectModel, context.args),
        runOnTechnicalReview: ({ context }) => this._onPendingResources.run(context.project as ProjectModel, context.args),
      },
    });
  }
}