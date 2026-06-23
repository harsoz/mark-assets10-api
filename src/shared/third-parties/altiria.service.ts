import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AltiriaService {
  private readonly logger = new Logger(AltiriaService.name);
  
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.endpoint = this.configService.get<string>('SMS_ENDPOINT') ?? '';
    this.apiKey = this.configService.get<string>('SMS_API_KEY') ?? '';
    this.apiSecret = this.configService.get<string>('SMS_API_SECRET') ?? '';
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    const payload = {
      credentials: {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
      },
      destination: [phoneNumber],
      message: {
        msg: `Hola, su codigo de verificacion de Assets10 es ${code}`,
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.endpoint, payload)
      );

      this.logger.debug(response.data); 

      return true;
    } catch (error) {
      this.logger.error('Error al enviar el código de verificación por SMS', error);
      return false;
    }
  }
}