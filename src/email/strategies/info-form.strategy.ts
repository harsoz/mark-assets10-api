import { IEmailStrategy } from '../interfaces/email-strategy.interface';

interface InfoFormParams {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
}

export class InfoFormStrategy implements IEmailStrategy {
  build(params: any, template: string) {
    const parameters = params as InfoFormParams;

    return {
      subject: 'Informacion Solicitada - Assets 10',
      html: template
        .replace(/{{CustomerName}}/g, parameters.customerName)
        .replace(/{{CustomerEmail}}/g, parameters.customerEmail)
        .replace(/{{CustomerPhone}}/g, parameters.customerPhone)
        .replace(/{{Message}}/g, parameters.message),
    };
  }
}