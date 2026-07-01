import { createActor } from 'xstate';
import { Injectable, Logger } from '@nestjs/common';
import { ProjectModel } from 'src/domain/models';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { ProjectRepository } from 'src/infrastructure/repository';
import { StateMachineCollectionService } from './state-machine-collection.service';

@Injectable()
export class StateMachineService {
  private readonly _logger = new Logger(StateMachineService.name);

  constructor(
    private readonly _repository: ProjectRepository,
    private readonly _machineCollectionService: StateMachineCollectionService,
  ) {}

  async resolveNextStateById(projectId: string, event: string) {
    const project = await this._repository.findById(projectId);

    if (!project) throw new Error(`Project not found for id: ${projectId}`);
    const mappedProject = this._repository.toModel(project);

    await this.resolveNextStateByProject(mappedProject, event);
  }

  async resolveNextStateByProject(project: ProjectModel, event: string) {
    try {
      const projectMachine = this._machineCollectionService.getMachine(
        project.projectType,
      );
      if (!projectMachine)
        throw new Error(
          `Machine not found for project type: ${project.projectType}`,
        );

      const projectActor = createActor(
        projectMachine.getStateMachine(project.status as string),
        {
          input: { project },
        },
      );

      projectActor.start();

      projectActor.send({ type: event });

      const nextState = projectActor.getSnapshot();

      const newStatus = nextState.value as string;

      await this._updateProjectStatus(project, newStatus as ProjectStatus);

      projectActor.stop();
    } catch (error) {
      this._logger.error(error);
    }
  }

  private async _updateProjectStatus(
    project: ProjectModel,
    newStatus: ProjectStatus,
  ) {
    if (Object.values(ProjectStatus).includes(newStatus as ProjectStatus)) {
      project.status = newStatus as ProjectStatus;

      await this._repository.update(project.id, project);
    }
  }
}
