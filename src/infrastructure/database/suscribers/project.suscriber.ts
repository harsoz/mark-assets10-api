import { 
  EventSubscriber, 
  EntitySubscriberInterface, 
  InsertEvent, 
  UpdateEvent,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { UserProject } from '../user-project.entity';
import { ProjectType } from '../../../domain/types/project.type';

@EventSubscriber()
export class EntityEventSubscriber implements EntitySubscriberInterface {

  async beforeInsert(event: InsertEvent<any>) {
    if (event.entity instanceof Project) {
      await this.handleUserProjectRegistry(event);
    }
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    if (event.entity instanceof Project) {
      await this.handleUserProjectRegistry(event);
    }
  }

  private async handleUserProjectRegistry(event: InsertEvent<any> | UpdateEvent<any>) {
    const project = event.entity as Project;
    const manager = event.manager;

    const existing = await manager.findOne(UserProject, {
      where: { 
        projectId: project.id, 
        userId: project.ownerId 
      }
    });

    if (existing) {
      await manager.update(UserProject, existing.id, { 
        status: project.status 
      });
    } else {
      const projectTypeName = project.constructor.name;

      await manager.save(UserProject, {
        userId: project.ownerId,
        projectId: project.id,
        projectType: ProjectType[projectTypeName],
        status: project.status
      });
    }
  }
}