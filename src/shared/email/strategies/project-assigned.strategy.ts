import { IEmailStrategy } from '../interfaces/email-strategy.interface';

interface ProjectAssignedParams {
  project: {
    id: number;
    title: string;
    description: string;
  };
  feUri: string;
  projectType: string;
}

export class ProjectAssignedStrategy implements IEmailStrategy {
  build(params: any, template: string) {
    const parameters = params as ProjectAssignedParams;
    
    const projectUrl = `${parameters.feUri}/project/${parameters.projectType}/view/${parameters.project.id}`;

    return {
      subject: 'Se te ha asignado una nueva publicacion - Assets 10',
      html: template
        .replace(/{{ProjectTitle}}/g, parameters.project.title)
        .replace(/{{ProjectDescription}}/g, parameters.project.description)
        .replace(/{{ProjectURL}}/g, projectUrl),
    };
  }
}