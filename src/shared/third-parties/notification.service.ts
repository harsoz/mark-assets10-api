import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly httpService: HttpService) {}

  async pushProjectNotification(
    user: any,
    project: any,
    type: string,
    socketsTo: string[],
    content: any,
    emailContent: any,
    metadata: any,
  ) {
    if (!user) return;

    const role = user.roles?.[0]?.name ?? '';

    const payload = {
      type,
      userFrom: {
        id: user.id,
        name: user.name,
        pictureUrl: user.profilePicture ?? '',
        role,
        accountType: role,
        email: user.email,
      },
      project: {
        id: project.id,
        name: project.title,
        ownerId: project.ownerId,
        approverId: project.approverId,
        lawyerId: project.lawyerId,
        analystId: project.analystId,
      },
      socketsTo,
      content,
      emailContent,
      metadata,
    };

    try {
      await firstValueFrom(
        this.httpService.post('notification/create', payload),
      );
    } catch (error: any) {
      this.logger.error(`Error creating notification: ${error.message}`);
    }
  }

  async pushActionNotification(
    user: any,
    type: string,
    socketsTo: string[],
    metadata: any,
    singleMode = true,
  ) {
    if (!user) return;

    const role = user.roles?.[0]?.name ?? '';
    const updatedSockets = [...socketsTo, user.id];

    const payload = {
      userFrom: {
        id: user.id,
        name: user.name,
        pictureUrl: user.profilePicture ?? '',
        role,
        accountType: role,
        email: user.email,
      },
      type,
      socketsTo: updatedSockets,
      singleMode,
      metadata,
    };

    try {
      await firstValueFrom(this.httpService.post('action/create', payload));
    } catch (error: any) {
      this.logger.error(`Error creating action: ${error.message}`);
    }
  }
}
