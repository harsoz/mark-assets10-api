import { Injectable } from '@nestjs/common';
import { ProjectModel } from 'src/domain/models';
import { EmailService } from 'src/shared/email/email.service';
import { NotificationService } from 'src/shared/third-parties/notification.service';
import { IEvent } from '../interfaces/event.interface';

@Injectable()
export class OnPendingResourcesEvent implements IEvent {
  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _emailService: EmailService,
  ) {}

  run(project: ProjectModel ) {
    // send emails, notifications... fire and forget
  }
}
