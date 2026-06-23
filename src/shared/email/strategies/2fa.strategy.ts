import { IEmailStrategy } from '../interfaces/email-strategy.interface';

interface TwoFactorParams {
  email: string;
  code: string;
}

export class TwoFactorStrategy implements IEmailStrategy {
  build(params: any, template: string) {
    const p = params as TwoFactorParams;

    return {
      subject: 'Código de verificación',
      html: template
        .replace(/{{Code}}/g, p.code)
        .replace(/{{CustomerEmail}}/g, p.email),
    };
  }
}