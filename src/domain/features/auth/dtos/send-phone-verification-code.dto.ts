import { IsOptional } from 'class-validator';

export class SendPhoneVerificationDTO {
  @IsOptional()
  phoneNumber?: string;
}