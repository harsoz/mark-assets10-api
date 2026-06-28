import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyPhoneDTO {
  
  @IsString()
  @IsNotEmpty({ message: 'El código de verificación es obligatorio' })
  @Length(6, 6, { message: 'El código debe tener exactamente 6 caracteres' })
  phoneVerificationCode: string = '';
}