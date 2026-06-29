import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthCodeRepository,
  TrustedDeviceRepository,
  UserRepository,
} from 'src/infrastructure/repository';
import { RegisterDTO } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { UserStatus } from 'src/domain/types/user-status.type';
import { EmailService } from 'src/shared/email/email.service';
import { LoginDTO } from './dtos/login.dto';
import { MoreThan, MoreThanOrEqual } from 'typeorm';
import { RefreshDTO } from './dtos/refresh.dto';
import { VerifyMfaDTO } from './dtos/verify-mfa.dto';
import { PhoneService } from './phone.service';
import { VerifyPhoneDTO } from './dtos/verify-phone.dto';
import { SendPhoneVerificationDTO } from './dtos/send-phone-verification-code.dto';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { mapToSignUpResponse } from './maps/sing-up.map';
import { AccessTokenResponseDTO } from './responses/acces-token.response';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger(AuthService.name);

  constructor(
    private readonly _userRepository: UserRepository, // replace this with _userService later
    private readonly _authCodeRepository: AuthCodeRepository,
    private readonly _trustedDeviceRepository: TrustedDeviceRepository,
    private readonly _emailService: EmailService,
    private readonly _phoneService: PhoneService,
    private readonly _tokenService: TokenService,
  ) {}

  async signUp(payload: RegisterDTO) {
    if (payload.password !== payload.confirmPassword) {
      throw new BadRequestException(
        'The password and confirm password mismatch',
      );
    }

    const emailLower = payload.email.toLowerCase().trim();
    const existingUser = await this._userRepository.findOne({
      where: { email: emailLower },
    });
    if (existingUser) {
      throw new ConflictException('The email is already registered');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // create the very new user
    const newUser = await this._userRepository.create({
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      email: emailLower,
      password: hashedPassword,
      twoFactorEnabled: false, // probably need to change to true by default
      //emailConfirmed: true, probably we need to configure this later, legacy set this as true since the beginning
      status: UserStatus.Active,
    });

    // fire and forget
    this._emailService
      .send(
        'account-created',
        { name: payload.name, email: payload.email },
        newUser.email,
      )
      .catch((error) => this._logger.error(error));

    return mapToSignUpResponse(this._userRepository.toModel(newUser));
  }

  async signIn(payload: LoginDTO, isAdminPanel: boolean = false): Promise<any> {
    const user = await this._userRepository.findOne({
      where: { email: payload.email },
    });
    if (!user || !(await bcrypt.compare(payload.password, user.password))) {
      // handle maybe intents
      throw new UnauthorizedException('Invalid credentials');
    }

    // potentially integrated later
    // if (!isPasswordValid) {
    //   await this._handleFailedAccess(user);
    //   throw new UnauthorizedException('Credenciales inválidas.');
    // }

    // if (user.accessFailedCount > 0) {
    //   await this._userRepo.update(user.id, { accessFailedCount: 0, lockoutEnd: null });
    // }

    if (user.twoFactorEnabled && !isAdminPanel) {
      const isTrusted = await this._trustedDeviceRepository.findOne({
        where: {
          userId: user.id,
          deviceId: payload.deviceId,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!isTrusted) {
        const code = await this._phoneService.generateMfaCode();

        const authCode = await this._authCodeRepository.create({
          userId: user.id,
          code,
        });

        // fire and forget
        this._emailService
          .send('2fa', { email: user.email, code }, user.email)
          .catch((error) => this._logger.error(error));

        return {
          requiresMFA: true,
          message: 'Se requiere verificación de dos factores',
          redirectUrl: '/verify-mfa',
          token: authCode.id,
          success: true,
        };
      }
    }

    const accessRequest = { sub: user.id, email: user.email };
    return await this._tokenService.generateAuthTokens(accessRequest);
  }

  async signInAdmin(payload: LoginDTO) {
    const user = await this._userRepository.findOne({
      where: { email: payload.email.toLowerCase().trim() },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // if (user.lockoutEnd && user.lockoutEnd > new Date()) {
    //   throw new UnauthorizedException('La cuenta está temporalmente bloqueada debido a múltiples intentos fallidos.');
    // }
    // if (user.accessFailedCount > 0) {
    //   await this._userRepo.update(user.id, { accessFailedCount: 0, lockoutEnd: null });
    // }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'Acceso restringido, solo administradores',
      );
    }

    // check if we need to include role in token
    const accessRequest = { sub: user.id, email: user.email, role: 'admin' };
    return (await this._tokenService.generateAuthTokens(
      accessRequest,
    )) as AccessTokenResponseDTO;
  }

  async refresh(payload: RefreshDTO) {
    try {
      const newAccessToken = await this._tokenService.verifyToken(
        payload.refreshToken,
      );

      const user = await this._userRepository.findOne({
        where: { id: newAccessToken.sub },
      });

      if (!user || user.status !== UserStatus.Active) {
        throw new UnauthorizedException('Access denied');
      }

      // para poder revocar sesiones si cambian la contraseña o los das de baja.
      // if (user.tokenVersion !== newAccessToken.tokenVersion) {
      //   throw new UnauthorizedException('Session expired or revoked.');
      // }

      const newPayload = {
        sub: user.id,
        email: user.email,
        // role: user.role
      };

      const accessToken =
        await this._tokenService.generateAccessToken(newPayload);

      return {
        accessToken,
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'El Refresh token ha expirado. Por favor, inicia sesión de nuevo.',
        );
      }

      throw new UnauthorizedException('El Refresh token es inválido.');
    }
  }

  async verifyToken(userId: string) {
    const user = await this._userRepository.findOne({
      where: { id: userId },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });

    if (!user) {
      return null;
    }

    let hasAdminRole = false;
    const permissionsSet = new Set<string>();
    const roleNames: string[] = [];

    if (user.roles) {
      user.roles.forEach((role) => {
        roleNames.push(role.name);

        if (role.isAdmin) {
          hasAdminRole = true;
        }

        if (role.permissions) {
          role.permissions.forEach((perm) => {
            permissionsSet.add(perm.value);
          });
        }
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      status: user.status,
      isAdmin: hasAdminRole,
      role: roleNames[0] || null,
      permissions: Array.from(permissionsSet),
    };
  }

  async verifyMfa(payload: VerifyMfaDTO) {
    const authCode = await this._authCodeRepository.findOne({
      where: {
        // userId: userId, // potentially not used
        code: payload.code,
        used: false,
      },
      relations: { user: true },
    });

    if (!authCode) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'El código ingresado es incorrecto.',
        type: 'InvalidCode',
      });
    }

    if (authCode.expiresAt < new Date()) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'El código ingresado ya expiró, por favor solicite uno nuevo.',
        type: 'ExpiredCode',
      });
    }

    const user = authCode.user;
    if (!user || !user.email) {
      throw new BadRequestException(
        'El correo electrónico del usuario no es válido.',
      );
    }

    authCode.used = true;
    await this._authCodeRepository.update(authCode.id, authCode);

    if (payload.deviceId) {
      const trustedDevice = await this._trustedDeviceRepository.findOne({
        where: {
          userId: user.id,
          deviceId: payload.deviceId,
        },
      });

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      if (trustedDevice) {
        trustedDevice.expiresAt = expirationDate;
        await this._trustedDeviceRepository.update(
          trustedDevice.id,
          trustedDevice,
        );
      } else {
        await this._trustedDeviceRepository.create({
          deviceId: payload.deviceId,
          userId: user.id,
          expiresAt: expirationDate,
        });
      }
    }

    const accessRequest = {
      sub: user.id,
      email: user.email,
      // role: 'user.role ', check this
    };

    return await this._tokenService.generateAuthTokens(accessRequest);
  }

  async verifyPhone(payload: VerifyPhoneDTO, userId: string) {
    return await this._phoneService.verifyPhone(payload, userId);
  }

  async sendPhoneVerificationCode(
    payload: SendPhoneVerificationDTO,
    userId: string,
  ) {
    return await this._phoneService.sendPhoneVerificationCode(payload, userId);
  }

  async changePassword(
    dto: ChangePasswordDTO,
    userId: string,
  ): Promise<boolean> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const user = await this._userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    user.password = await bcrypt.hash(dto.password, 10);

    await this._userRepository.update(user.id, user);

    return true;
  }

  async resendCode(token: string): Promise<boolean> {
    const codeEntity = await this._authCodeRepository.findOne({
      where: {
        id: token,
        used: false,
        expiresAt: MoreThanOrEqual(new Date()),
      },
      relations: {
        user: true,
      },
    });

    if (!codeEntity) {
      throw new BadRequestException({
        message:
          'El código no existe o ya expiró. Por favor, reingrese sus credenciales',
        error: 'ExpiredCode',
      });
    }

    if (!codeEntity.user) {
      throw new NotFoundException('User does not exist');
    }

    codeEntity.code = this._phoneService.generateMfaCode();

    await this._authCodeRepository.update(codeEntity.id, codeEntity);

    // fire and forget
    this._emailService
      .send(
        '2fa',
        { email: codeEntity.user.email, code: codeEntity.code },
        codeEntity.user.email,
      )
      .catch((error) => this._logger.error(error));

    return true;
  }
}

/*

// it's not part of auth
public async Task<ActionResult<bool>> UpdateProfile([FromForm] UpdateProfileDTO request)
public async Task<ActionResult<ABSUser>> UpdateLanguage([FromForm] UpdateLanguageDTO request)
 */
