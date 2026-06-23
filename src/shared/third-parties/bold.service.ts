import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BoldStatus } from './responses/bold.dto';

@Injectable()
export class BoldService {
  private readonly logger = new Logger(BoldService.name);
  
  private readonly endpoint: string;
  private readonly accessKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.endpoint = this.configService.get<string>('BOLD_API_ENDPOINT') ?? '';
    this.accessKey = this.configService.get<string>('BOLD_ACCESS_KEY') ?? '';
  }

  async getPaymentStatus(guide: string): Promise<BoldStatus> {
    const url = `${this.endpoint}v2/payment-voucher/${guide}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<BoldStatus>(url, {
          headers: {
            Authorization: `x-api-key ${this.accessKey}`,
          },
        })
      );

      return response.data;
      
    } catch (error) {
      this.logger.error(`Error al obtener el estado del pago (guía: ${guide})`, error);
      throw error; 
    }
  }
}