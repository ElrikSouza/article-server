import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from 'src/users/dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { HashService } from './hash/hash.service';
import { SignInDTO } from 'src/users/dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await this.hashService.hash(signUpDto.password);

    await this.usersService.saveUser({
      ...signUpDto,
      password: hashedPassword,
    });
  }

  async signIn(signInDto: SignInDTO): Promise<string> {
    const user = await this.usersService.findByEmailOrThrow(signInDto.email);
    const doPasswdsMatch = await this.hashService.compareDataToHash(
      signInDto.password,
      user.password,
    );

    if (!doPasswdsMatch) throw new NotFoundException('User not found');

    const payload: AuthTokenPayload = {
      email: user.email,
      id: user.id,
      fullName: user.fullName,
    };

    return this.jwtService.signAsync(payload);
  }
}
