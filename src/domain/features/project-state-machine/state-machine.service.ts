import { createActor } from 'xstate';
import { Injectable } from '@nestjs/common';
import { ProjectModel } from 'src/domain/models';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { ProjectRepository } from 'src/infrastructure/repository';
import { StateMachineCollectionService } from './state-machine-collection.service';

@Injectable()
export class StateMachineService {
  constructor(
    private readonly _repository: ProjectRepository,
    private readonly _machineCollectionService: StateMachineCollectionService,
  ) {}

  async transitionProject(project: ProjectModel, event: string) {
    const projectMachine = this._machineCollectionService.getMachine(
      project.projectType,
    );

    const projectActor = createActor(projectMachine, {
      input: { project },
    });

    projectActor.start();

    projectActor.send({ type: event });

    const nextState = projectActor.getSnapshot();

    const newStatus = nextState.value as string;

    if (Object.values(ProjectStatus).includes(newStatus as ProjectStatus)) {
      project.status = newStatus as ProjectStatus;

      // we can evaluate whether we need a notification

      await this._repository.update(project.id, project);
    }

    projectActor.stop();
  }
}
