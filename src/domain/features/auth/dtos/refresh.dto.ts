import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDTO {
  @IsString()
  @IsNotEmpty({ message: 'El token de refresco es requerido' })
  refreshToken!: string;
}