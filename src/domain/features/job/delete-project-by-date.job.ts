import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandCollection } from '../project/commands/collection.command';
import { ProjectStatus } from 'src/domain/types/project-status.type';

@Injectable()
export class DeleteProjectByDateJob {
  private readonly logger = new Logger(DeleteProjectByDateJob.name);
  private readonly _daysToDelete: number;
  private readonly _statusToDelete: ProjectStatus[];

  constructor(private readonly _commands: CommandCollection) {
    this._daysToDelete = 30; // comming from config
    this._statusToDelete = [ProjectStatus.Cancelled, ProjectStatus.Expired];
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async deleteProjectsByDays() {
    this.logger.log('Deleting projects by days');
    try {
      const tasks: Promise<void>[] = [];
      const projectCommands = this._commands.getCommandCollection();
      projectCommands.forEach((command) => {
        tasks.push(
          command.deleteByDays(this._daysToDelete, this._statusToDelete),
        );
      });
      await Promise.all(tasks);
    } catch (error: any) {
        this.logger.error(`Error deleting projects by days: ${error.message}`);
    }

    this.logger.log('Projects deleted by days');
  }
}
