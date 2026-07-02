import { Injectable, Logger } from '@nestjs/common';
import { ProjectModel } from 'src/domain/models';
import { EmailService } from 'src/shared/email/email.service';
import { NotificationService } from 'src/shared/third-parties/notification.service';
import { IEvent } from '../interfaces/event.interface';
import { ProjectRepository } from 'src/infrastructure/repository';

@Injectable()
export class OnPendingResourcesEvent implements IEvent {
  private readonly _logger = new Logger(OnPendingResourcesEvent.name);

  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _emailService: EmailService,
    private readonly _projectRepository: ProjectRepository,
  ) {}

  /**
   * 
   * @param project details of the project being processed
   * @param args any aditional information to perform work
   */
  run(project: ProjectModel, args?: any ) {
    // send emails, notifications... fire and forget
    this._logger.debug("event has been fired")
  }
}
