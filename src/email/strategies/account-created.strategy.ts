import { IEmailStrategy } from '../interfaces/email-strategy.interface';

interface AccountParams {
  user: { name: string };
  email: string;
}

export class AccountCreatedStrategy implements IEmailStrategy {
  build(params: any, template: string) {
    const parameters = params as AccountParams;

    return {
      subject: 'Cuenta Creada - [Casilleros Xlocker]',
      html: template
        .replace(/{{CustomerName}}/g, parameters.user.name)
        .replace(/{{CustomerEmail}}/g, parameters.email),
    };
  }
}
