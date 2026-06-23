export interface IEmailStrategy {
  build(params: any, template: string): { subject: string; html: string };
}