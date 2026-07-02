import { Injectable } from '@nestjs/common';
import { ProjectModel } from 'src/domain/models';
import { IStateMachine } from '../interfaces/state-machine.interface';
import { StatefulActions } from './config/stateful.actions';

import { statelessConfig } from './config/stateless.config';
import { statefulConfig } from './config/stateful.config';
import { StatelessActions } from './config/stateless.actions';

@Injectable()
export class BaseMachine implements IStateMachine {
  private readonly _machineCache = new Map<string, any>();

  constructor(
    private readonly _statefulActions: StatefulActions,
    private readonly _statelessActions: StatelessActions,
  ) {}

  getStatefulMachine(state: string) {
    const cachedMachine = this._machineCache.get(state);
    if (cachedMachine) {
      return cachedMachine;
    }

    const machine = this._statefulActions.setupActions().createMachine({
      id: 'project',
      initial: state,
      context: ({ input }) => ({
        project: input?.project as ProjectModel,
        args: input?.args as any,
      }),
      states: statefulConfig as any,
    });

    this._machineCache.set(state, machine);
    return machine;
  }

  getStatelessMachine() {
    const cachedMachine = this._machineCache.get('stateless-machine');
    if (cachedMachine) {
      return cachedMachine;
    }
    const machine = this._statelessActions.setupActions().createMachine({
      id: 'project',
      initial: 'draft',
      context: ({ input }) => ({
        project: input?.project as ProjectModel,
        args: input?.args as any,
      }),
      on: statelessConfig as any,
      states: {
        draft: {},
      },
    });

    this._machineCache.set('stateless-machine', machine);
    return machine;
  }
}
