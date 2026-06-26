import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandCollection } from '../project/commands/collection.command';
import { ProjectStatus } from 'src/domain/types/project-status.type';

@Injectable()
export class DeleteProjectByDateJob {
  private readonly logger = new Logger(DeleteProjectByDateJob.name);
  private readonly _daysToExpire: number;

  constructor(private readonly _commands: CommandCollection) {
    this._daysToExpire = 10; // comming from config
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async deleteProjectsByDays() {
    this.logger.log('Expiring projects');
    try {
      const tasks: Promise<void>[] = [];
      const projectCommands = this._commands.getCommandCollection();
      projectCommands.forEach((command) => {
        tasks.push(command.expire(this._daysToExpire));
      });
      await Promise.all(tasks);
    } catch (error: any) {
      this.logger.error(`Error expiring projects: ${error.message}`);
    }

    this.logger.log('Projects have been expired');
  }
}
