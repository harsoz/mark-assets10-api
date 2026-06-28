import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// not sure about handling error messages
export class RegisterDTO { // change name later
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono es requerido' })
  phoneNumber!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirmar contraseña es requerido' })
  confirmPassword!: string;
}