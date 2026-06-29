import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  UserRepository,
  VerifiedPhoneRepository,
} from 'src/infrastructure/repository';
import { VerifyPhoneDTO } from './dtos/verify-phone.dto';
import { SendPhoneVerificationDTO } from './dtos/send-phone-verification-code.dto';
import { AltiriaService } from 'src/shared/third-parties/altiria.service';

@Injectable()
export class PhoneService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _verifiedPhoneRepository: VerifiedPhoneRepository,
    private readonly _altiriaService: AltiriaService,
  ) {}

  async verifyPhone(
    payload: VerifyPhoneDTO,
    userId: string,
  ): Promise<{ data: string; status: number }> {
    const user = await this._userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (payload.phoneVerificationCode !== user.phoneVerificationCode) {
      throw new BadRequestException('Verification code mismatch');
    }

    user.phoneNumberConfirmed = true;
    let message = 'El telefono se ha verificado correctamente.';

    if (!user.rewardClaimed) {
      const isPhoneAlreadyVerified =
        await this._verifiedPhoneRepository.findOne({
          where: { phoneNumber: user.phoneNumber },
        });

      if (!isPhoneAlreadyVerified) {
        message =
          'El telefono se ha verificado correctamente y se ha proporcionado un bono de bienvenida!';

        await this._verifiedPhoneRepository.create({
          phoneNumber: user.phoneNumber || '',
        });

        user.rewardClaimed = true;
      } else {
        message =
          'El telefono se ha verificado correctamente pero la recompensa para este numero ya ha sido redimida.';
      }
    }

    await this._userRepository.update(user.id, user);

    return { data: message, status: 200 };
  }

  async sendPhoneVerificationCode(
    payload: SendPhoneVerificationDTO,
    userId: string,
  ): Promise<boolean> {
    const user = await this._userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (!user.phoneNumber && !payload.phoneNumber) {
      throw new BadRequestException('Phone number not found');
    }

    const code = this.generateMfaCode();

    if (payload.phoneNumber) {
      user.phoneNumber = payload.phoneNumber;
    }
    user.phoneVerificationCode = code;

    const result = await this._userRepository.update(user.id, user);

    // fire and forget
    this._altiriaService
      .sendVerificationCode(user.phoneNumber || '', code)
      .catch((err) => console.error('Error enviando SMS:', err));

    return !!result;
  }

  // this might need its own service, but it's only in auth service for now
  generateMfaCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }
}
