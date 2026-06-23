import { IEmailStrategy } from '../interfaces/email-strategy.interface';

interface ProjectDeletedParams {
  project: {
    title: string;
    description: string;
  };
}

export class ProjectDeletedStrategy implements IEmailStrategy {
  build(params: any, template: string) {
    const parameters = params as ProjectDeletedParams;
    
    return {
      subject: 'Publicacion eliminada - Assets 10',
      html: template
        .replace(/{{ProjectTitle}}/g, parameters.project.title)
        .replace(/{{ProjectDescription}}/g, parameters.project.description),
    };
  }
}