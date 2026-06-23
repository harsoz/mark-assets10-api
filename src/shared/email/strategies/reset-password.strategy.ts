import { IEmailStrategy } from '../interfaces/email-strategy.interface';

interface ResetPasswordParams {
  user: { name: string };
  email: string;
  resetLink: string;
  appDomain: string;
}

export class ResetPasswordStrategy implements IEmailStrategy {
  build(params: any, template: string) {
    const p = params as ResetPasswordParams;
    
    const emailBase64 = Buffer.from(p.email).toString('base64');
    const resetUrl = `https://${p.appDomain}/restore-password/${p.resetLink}:::${emailBase64}`;

    return {
      subject: 'Recuperar Acceso - Assets10 Admin',
      html: template
        .replace(/{{CustomerName}}/g, p.user.name)
        .replace(/{{CustomerEmail}}/g, p.email)
        .replace(/{{ResetURL}}/g, resetUrl),
    };
  }
}