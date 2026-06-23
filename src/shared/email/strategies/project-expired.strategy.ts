import { IEmailStrategy } from '../interfaces/email-strategy.interface';

interface ProjectExpiredParams {
  project: {
    id: number;
    title: string;
    description: string;
  };
  feUri: string;
  projectType: string;
}

export class ProjectExpiredStrategy implements IEmailStrategy {
  build(params: any, template: string) {
    const parameters = params as ProjectExpiredParams;
    
    const projectUrl = `${parameters.feUri}/project/${parameters.projectType}/view/${parameters.project.id}`;

    return {
      subject: 'Publicacion expirada - Assets 10',
      html: template
        .replace(/{{ProjectTitle}}/g, parameters.project.title)
        .replace(/{{ProjectDescription}}/g, parameters.project.description)
        .replace(/{{ProjectURL}}/g, projectUrl),
    };
  }
}