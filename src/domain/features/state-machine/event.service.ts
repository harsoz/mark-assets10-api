import { Injectable } from '@nestjs/common';
import { ProjectModel } from 'src/domain/models';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { IEvent } from './interfaces/event.interface';
import { OnPendingResourcesEvent } from './events/on-pending-resources.event';

@Injectable()
export class EventService {
  private readonly _dictionary: Map<ProjectStatus, IEvent> = new Map();
  constructor(protected readonly _onPendingResourcesEvent: OnPendingResourcesEvent) {
    this._dictionary = new Map([
      [ProjectStatus.PendingResources, _onPendingResourcesEvent],
    ]);
  }

  async emit(project: ProjectModel, status: ProjectStatus) {
    const event = this._dictionary.get(status);
    if (!event) throw new Error(`Event not found for: ${status}`);

    // fire and forget
    event.run(project).catch(console.error);
  }
}
